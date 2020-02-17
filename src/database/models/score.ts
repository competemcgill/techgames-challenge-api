import { IScore } from "../../interfaces/score";
import { Schema, Document, Model, model } from "mongoose";

export interface IScoreModel extends IScore, Document {}

const scoreSchema: Schema = new Schema({
    liveness: {
        type: Boolean,
        select: true
    },
    indexArticles: {
        type: Boolean,
        select: true
    },
    showArticles200: {
        type: Boolean,
        select: true
    },
    showArticles400: {
        type: Boolean,
        select: true
    },
    showArticles404: {
        type: Boolean,
        select: true
    },
    createArticles200: {
        type: Boolean,
        select: true
    },
    createArticles400: {
        type: Boolean,
        select: true
    },
    updateArticles200: {
        type: Boolean,
        select: true
    },
    updateArticles400: {
        type: Boolean,
        select: true
    },
    updateArticles404: {
        type: Boolean,
        select: true
    },
    timestamp: {
        type: String,
        select: true
    },
    deleteArticles200: {
        type: Boolean,
        select: true
    },
    deleteArticles400: {
        type: Boolean,
        select: true
    },
    deleteArticles404: {
        type: Boolean,
        select: true
    },
});

const Score: Model<IScoreModel> = model<IScoreModel>("Score", scoreSchema);

export { Score };