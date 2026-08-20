import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId?: string;
}
export declare function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=requireAuth.d.ts.map