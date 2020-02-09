import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../util/errorFormatter";
import { statusCodes } from "../util/statusCodes";
import { userDBInteractions } from "../database/interactions/user";
import { User, IUserModel } from "../database/models/user";
import { IUser } from "../interfaces/user";
import axios from "axios";

const userController = {

    index: async (req: Request, res: Response) => {
        try {
            const users = await userDBInteractions.all();
            res.status(statusCodes.SUCCESS).send(users);  
        } catch(error) {
            res.status(statusCodes.SERVER_ERROR).send(error);
        }    
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
            try {
                const foundUser: IUserModel = await userDBInteractions.findByEmail(req.body.email);
                if (foundUser) {
                    res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, message: "User already exists" });
                } else {
                    const userData: IUser = {
                        email: req.body.email,
                        githubToken: req.body.githubToken,
                        githubUsername: req.body.githubUsername,
                        githubRepo: "https://github.com/" + req.body.githubUsername + "/techgames-api-challenge-template",
                        scores: []
                    };

                    if (process.env.NODE_ENV == "production") {
                        try {
                            await axios.post("https://api.github.com/repos/Compete-McGill/techgames-api-challenge-template/forks", {}, {
                                                headers: {
                                                    Authorization: "Bearer " + userData.githubToken
                                                }
                                            });
                        } catch (error) {
                            res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, message: "Invalid github token" })
                            return;
                        }
                    }

                    const newUser: IUserModel = await userDBInteractions.create(new User(userData));

                    res.status(statusCodes.SUCCESS).send(newUser);
                }
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).send(error);
            }
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
            try{
                const user = await userDBInteractions.delete(req.params.userId);
                res.status(statusCodes.SUCCESS).send({msg:user });
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).send(error);
            }
        }
    }
};

export { userController };