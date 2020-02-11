import { IScore } from "../../interfaces/score";
import { Schema, Document, Model, model } from "mongoose";

export interface IScoreModel extends IScore, Document {}

const scoreSchema: Schema = new Schema({
    liveness: {
        type: Boolean,
        select: true
    },
    authenticate200: {
        type: Boolean,
        select: true
    },
    authenticate403: {
        type: Boolean,
        select: true
    },
    createAccount201: {
        type: Boolean,
        select: true
    },
    createAccount400: {
        type: Boolean,
        select: true
    },
    createAccount500: {
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
    showArticles404: {
        type: Boolean,
        select: true
    },
    createArticles201: {
        type: Boolean,
        select: true
    },
    createArticles400: {
        type: Boolean,
        select: true
    },
    createArticles403: {
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
    updateArticles401: {
        type: Boolean,
        select: true
    },
    updateArticles403: {
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
    deleteArticles401: {
        type: Boolean,
        select: true
    },
    deleteArticles403: {
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