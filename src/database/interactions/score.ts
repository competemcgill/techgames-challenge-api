import { IScore } from "../../interfaces/score";
import { Score, IScoreModel } from "../models/score";

export const scoreDBInteractions = {

    create: (score: IScore): Promise<IScoreModel> => {
        return Score.create(score);
    },
};