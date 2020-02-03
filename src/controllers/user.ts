import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../util/errorFormatter";
import { statusCodes } from "../util/statusCodes";

const userController = {

    index: async (req: Request, res: Response) => {
        res.status(statusCodes.SUCCESS).send({msg: "Not implemented"});
    },

    show: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            res.status(statusCodes.SUCCESS).send({msg: "Not implemented"});
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