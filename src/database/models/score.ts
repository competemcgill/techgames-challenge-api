import { IScore } from "../../interfaces/score";
import { Schema, Document, Model, model } from "mongoose";

export interface IScoreModel extends IScore, Document {}

const scoreSchema: Schema = new Schema({
    liveness: {
        type: Boolean,
        select: true
    },
    authentication: {
        type: String,
        select: true
    },
    createAccount: {
        type: String,
        select: true
    },
    authenticate: {
        type: String,
        select: true
    },
    getArticles: {
        type: String,
        select: true
    },
    getArticle: {
        type: String,
        select: true
    },
    postArticle: {
        type: String,
        select: true
    },
    putArticle: {
        type: String,
        select: true
    },
    deleteArticle: {
        type: String,
        select: true
    },
    timestamp: {
        type: String,
        select: true
    },
});

const Score: Model<IScoreModel> = model<IScoreModel>("Score", scoreSchema);

export { Score };