import { IScore } from "../../interfaces/score";
import { Schema, Document, Model, model } from "mongoose";

export interface IScoreModel extends IScore, Document {}

const scoreSchema: Schema = new Schema({
    liveness: {
        type: Boolean,
        select: false
    },
    authentication: {
        type: String,
        select: false
    },
    createAccount: {
        type: String,
        select: false
    },
    authenticate: {
        type: String,
        select: false
    },
    getArticles: {
        type: String,
        select: false
    },
    getArticle: {
        type: String,
        select: false
    },
    postArticle: {
        type: String,
        select: false
    },
    putArticle: {
        type: String,
        select: false
    },
    deleteArticle: {
        type: String,
        select: false
    },
    timestamp: {
        type: String,
        select: false
    },
});

const Score: Model<IScoreModel> = model<IScoreModel>("Score", scoreSchema);

export { Score };