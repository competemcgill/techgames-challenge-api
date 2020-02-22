import { Request, Response, NextFunction } from "express";
import { statusCodes } from "./statusCodes";

export const middleware = {
    auth: (req: Request, res: Response, next: NextFunction) => {
        const secret = req.headers["x-secret"];

        if (secret == process.env.SECRET) next();
        else {
            res.status(statusCodes.UNAUTHORIZED).send({ status: 401, message: "Unauthorized" });
        }
    }
}