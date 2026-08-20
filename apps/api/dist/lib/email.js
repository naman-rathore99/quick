"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendPasswordResetEmail(to, resetUrl) {
    await resend.emails.send({
        from: "QuickDidi <no-reply@quickdidi.com>",
        to,
        subject: "Reset your password",
        html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="font-size: 22px; font-weight: 700;">Reset your password</h2>
        <p style="color: #555;">Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}"
           style="display: inline-block; margin-top: 16px; padding: 12px 24px;
                  background: #000; color: #fff; border-radius: 8px;
                  text-decoration: none; font-weight: 600;">
          Reset Password
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
    });
}
//# sourceMappingURL=email.js.map