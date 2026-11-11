"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getSecrets() {
    const access = process.env.JWT_ACCESS_SECRET;
    const refresh = process.env.JWT_REFRESH_SECRET;
    if (!access || !refresh) {
        throw new Error("JWT secrets (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET) are not configured.");
    }
    return { access, refresh };
}
function signAccessToken(userId) {
    const { access } = getSecrets();
    return jsonwebtoken_1.default.sign({ sub: userId }, access, { expiresIn: "15m" });
}
function signRefreshToken(userId) {
    const { refresh } = getSecrets();
    return jsonwebtoken_1.default.sign({ sub: userId }, refresh, { expiresIn: "7d" });
}
function verifyAccessToken(token) {
    const { access } = getSecrets();
    return jsonwebtoken_1.default.verify(token, access);
}
function verifyRefreshToken(token) {
    const { refresh } = getSecrets();
    return jsonwebtoken_1.default.verify(token, refresh);
}
//# sourceMappingURL=jwt.js.map