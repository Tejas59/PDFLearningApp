import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


const authMiddleware: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { token } = req.cookies;


    if (!token) {
        res.status(401).json({
            status: false,
            message: "Not authorized. Please login.",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error: any) {
        res.status(401).json({ status: false, message: error.message });
    }
};


export default authMiddleware;