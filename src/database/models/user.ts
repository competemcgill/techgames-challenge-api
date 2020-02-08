import { IUser } from "../../interfaces/user";
import { Schema, Document, Model, model } from "mongoose";

export interface IUserModel extends IUser, Document {}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        select: false,
        unique: true
    },
    githubToken: {
        type: String,
        select: false
    },
    githubUsername: {
        type: String,
        select: false
    },
    githubRepo: {
        type: String,
        select: false
    },
    scores: {
        type: [Schema.Types.ObjectId],
        ref: "Score"
    }
});

const User: Model<IUserModel> = model<IUserModel>("User", userSchema);

export { User };