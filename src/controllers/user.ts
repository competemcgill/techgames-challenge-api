import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { errorMessage } from "../util/errorFormatter";
import { statusCodes } from "../util/statusCodes";
import { userDBInteractions } from "../database/interactions/user";
import { User, IUserModel } from "../database/models/user";
import { IUser } from "../interfaces/user";
import axios from "axios";
import { IScore } from "../interfaces/score";
import { IScoreModel } from "../database/models/score";
import { scoreDBInteractions } from "../database/interactions/score";

const userController = {

    index: async (req: Request, res: Response) => {
        try {
            const users = await userDBInteractions.all();
            res.status(statusCodes.SUCCESS).send(users);
        } catch (error) {
            res.status(statusCodes.SERVER_ERROR).send(error);
        }
    },

    show: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            try {
                const userId: string = req.params.userId;
                const user: IUserModel = await userDBInteractions.find(userId);
                user ? res.status(statusCodes.SUCCESS).send(user) : res.status(statusCodes.NOT_FOUND).send({ status: statusCodes.NOT_FOUND, message: "User not found" });
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).send(error);
            }
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
            try {
                const { userId } = req.params;
                const user: IUserModel = await userDBInteractions.find(userId);
                if (!user)
                    res.status(statusCodes.NOT_FOUND).send({ status: statusCodes.NOT_FOUND, message: "User not found" });
                else {
                    const userObject: IUser = {
                        email: user.email,
                        githubRepo: user.githubRepo,
                        githubToken: user.githubToken,
                        githubUsername: user.githubUsername,
                        scores: user.scores
                    };

                    const updatedUserBody: IUser = {
                        ...userObject,
                        ...req.body,
                        scores: user.scores
                    };

                    const updatedUser: IUserModel = await userDBInteractions.update(userId, updatedUserBody);
                    res.status(statusCodes.SUCCESS).send(updatedUser);
                }
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).send(error);
            }
        }
    },

    updateScore: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            try {
                const { userId } = req.params;
                const user: IUserModel = await userDBInteractions.find(userId);
                if (!user)
                    res.status(statusCodes.NOT_FOUND).send({ status: statusCodes.NOT_FOUND, message: "User not found" });
                else {
                    const scoreData: IScore = {
                        liveness: req.body.liveness,
                        indexArticles: req.body.indexArticles,
                        showArticles200: req.body.showArticles200,
                        showArticles400: req.body.showArticles400,
                        showArticles404: req.body.showArticles404,
                        createArticles200: req.body.createArticles200,
                        createArticles400: req.body.createAccount400,
                        updateArticles200: req.body.updateArticles200,
                        updateArticles400: req.body.updateArticles400,
                        updateArticles404: req.body.updateArticles404,
                        deleteArticles200: req.body.deleteArticles200,
                        deleteArticles400: req.body.deleteArticles400,
                        deleteArticles404: req.body.deleteArticles404,
                        timestamp: Date.now().toString(),
                    }

                    const newScore: IScoreModel = await scoreDBInteractions.create(scoreData);
                    user.scores.push(newScore._id)
                    user.save()

                    res.status(statusCodes.SUCCESS).send(newScore);
                }
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).send(error);
            }
        }
    },

    delete: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(errors.formatWith(errorMessage).array()[0]);
        } else {
            try {
                const user = await userDBInteractions.find(req.params.userId);
                if (user) {
                    await userDBInteractions.delete(req.params.userId);
                    res.status(statusCodes.SUCCESS).send(user);
                } else {
                    res.status(statusCodes.NOT_FOUND).send({ status: statusCodes.NOT_FOUND, message: "User not found" });
                }
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).send(error);
            }
        }
    }
};

export { userController };