import { Request, Response } from "express";
import { statusCodes } from "../util/statusCodes";
import { parseQueryString } from "../util/helper";
import { userDBInteractions } from "../database/interactions/user";
import { User, IUserModel } from "../database/models/user";
import { IUser } from "../interfaces/user";
import axios from "axios";

const authController = {
    github: async (req: Request, res: Response) => {
        try {
            const { data } = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: req.body.code,
                redirect_uri: req.body.redirectUri,
                grant_type: 'authorization_code'
            });

            const token = parseQueryString(data).access_token;

            if (!token) {
                res.status(statusCodes.BAD_REQUEST).send({ status: statusCodes.BAD_REQUEST, message: "Invalid user" });
            } else {
                const { data: githubUser } = await axios.get("https://api.github.com/user", {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                const foundUser: IUserModel = await userDBInteractions.findByGithubUsername(githubUser.login);
                if (foundUser) {
                    res.status(statusCodes.SUCCESS).send(foundUser);
                } else {
                    const userData: IUser = {
                        email: "",
                        githubToken: token,
                        githubUsername: githubUser.login,
                        githubRepo: "https://github.com/" + githubUser.login + "/techgames-api-challenge-template",
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
            }
        } catch (error) {
            res.status(statusCodes.SERVER_ERROR).json({ status: statusCodes.SERVER_ERROR, message: "Server Error" });
        }
    }
}

export { authController }