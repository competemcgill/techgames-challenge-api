import { IScore } from "../../interfaces/score";
import { Score, IScoreModel } from "../models/score";
import { IUser } from "../../interfaces/user";

export const scoreDBInteractions = {

    create: (score: IScore): Promise<IScoreModel> => {
        return Score.create(score);
    },

    getScoresByUser: (user: IUser): Promise<IScoreModel[]> => {
         return Score.find({ _id: { $in: user.scores } }).exec();
    }
};