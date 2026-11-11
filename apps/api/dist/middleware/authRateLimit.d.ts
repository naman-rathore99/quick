import type { RequestHandler } from "express";
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
export declare function authRateLimit(limit: number, emailLimit?: number): RequestHandler;
/**
 * General-purpose rate limiter for non-auth endpoints (bookings, providers, etc.).
 * Limits by IP only.
 */
export declare function apiRateLimit(limit: number, windowMinutes?: number): RequestHandler;
//# sourceMappingURL=authRateLimit.d.ts.map