"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = authRateLimit;
exports.apiRateLimit = apiRateLimit;
// ─── Configuration ─────────────────────────────────────────────────────────
const windowMs = 15 * 60 * 1000; // 15-minute sliding window
const capacity = 20000; // max tracked keys (OOM guard)
const globalWindowMs = 60000; // 1-minute global window
const globalLimit = 300; // max requests/minute across all IPs
// ─── Global rate-limit state (DoS / DDoS protection) ───────────────────────
let globalCount = 0;
let globalExpires = 0;
/**
 * Returns an Express middleware that rate-limits by:
 *   1. Global request count (all IPs combined) — protects against DDoS.
 *   2. Per-IP request count.
 *   3. (Optional) Per-IP+email compound key — protects against credential
 *      stuffing on a specific account.
 *
 * All counters are reset after failed attempts only; the counter increments
 * BEFORE the handler runs so both successful and failed requests count.
 */
function authRateLimit(limit, emailLimit) {
    const buckets = new Map();
    let nextSweep = 0;
    return (req, res, next) => {
        const now = Date.now();
        // ── Periodic sweep of expired buckets ──────────────────────────────
        if (now >= nextSweep) {
            for (const [key, bucket] of buckets) {
                if (bucket.expires <= now)
                    buckets.delete(key);
            }
            nextSweep = now + 60000;
        }
        // ── Global throttle ────────────────────────────────────────────────
        if (now >= globalExpires) {
            globalCount = 0;
            globalExpires = now + globalWindowMs;
        }
        if (globalCount >= globalLimit) {
            const retryAfter = Math.ceil((globalExpires - now) / 1000);
            res.set("Retry-After", String(retryAfter)).status(429).json({
                message: "Server is busy. Try again shortly.",
            });
            return;
        }
        globalCount++;
        // ── Per-key throttle (IP and optional IP+email) ────────────────────
        const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
        const email = typeof req.body?.email === "string" && req.body.email.length <= 254
            ? req.body.email.trim().toLowerCase()
            : "";
        const keys = [{ key: `ip:${ip}`, limit }];
        if (emailLimit && email) {
            keys.push({ key: `ip+email:${ip}:${email}`, limit: emailLimit });
        }
        for (const entry of keys) {
            let bucket = buckets.get(entry.key);
            if (!bucket || bucket.expires <= now) {
                if (!bucket && buckets.size >= capacity) {
                    res
                        .set("Retry-After", "60")
                        .status(429)
                        .json({ message: "Too many attempts. Try again shortly." });
                    return;
                }
                bucket = { count: 0, expires: now + windowMs };
                buckets.set(entry.key, bucket);
            }
            if (bucket.count >= entry.limit) {
                const retryAfter = Math.ceil((bucket.expires - now) / 1000);
                res.set("Retry-After", String(retryAfter)).status(429).json({
                    message: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} min.`,
                });
                return;
            }
            bucket.count++;
        }
        next();
    };
}
/**
 * General-purpose rate limiter for non-auth endpoints (bookings, providers, etc.).
 * Limits by IP only.
 */
function apiRateLimit(limit, windowMinutes = 1) {
    const windowMs = windowMinutes * 60 * 1000;
    const buckets = new Map();
    let nextSweep = 0;
    return (req, res, next) => {
        const now = Date.now();
        if (now >= nextSweep) {
            for (const [key, bucket] of buckets) {
                if (bucket.expires <= now)
                    buckets.delete(key);
            }
            nextSweep = now + 60000;
        }
        const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
        let bucket = buckets.get(ip);
        if (!bucket || bucket.expires <= now) {
            bucket = { count: 0, expires: now + windowMs };
            buckets.set(ip, bucket);
        }
        if (bucket.count >= limit) {
            const retryAfter = Math.ceil((bucket.expires - now) / 1000);
            res.set("Retry-After", String(retryAfter)).status(429).json({
                message: "Too many requests. Slow down.",
            });
            return;
        }
        bucket.count++;
        next();
    };
}
//# sourceMappingURL=authRateLimit.js.map