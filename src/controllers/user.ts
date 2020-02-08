import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../util/errorFormatter";
import { statusCodes } from "../util/statusCodes";
import { User, IUserModel } from "../database/models/user";
import { userDBInteractions} from "../database/interactions/user";

const userController = {

    index: async (req: Request, res: Response) => {
        res.status(statusCodes.SUCCESS).send({msg: "Not implemented"});
    },

    show: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        }
        else {
            try {
                const userId: string = req.params.userId;
                const user: IUserModel = await userDBInteractions.find(userId);
                user? res.status(statusCodes.SUCCESS).send(user) : res.status(statusCodes.NOT_FOUND).send({status: 404, message: "User not found" });
            }
            catch(error){
                res.status(500).send(error);
            }
        }
    },

    create: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            res.status(statusCodes.SUCCESS).send({msg: "Not implemented"});
        }
    },

    update: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            res.status(statusCodes.SUCCESS).send({msg: "Not implemented"});
        }
    },

    delete: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            res.status(statusCodes.SUCCESS).send({msg: "Not implemented"});
        }
    }
};

export { userController };