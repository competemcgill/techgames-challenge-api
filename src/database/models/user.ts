import { IUser } from "../../interfaces/user";
import { Schema, Document, Model, model } from "mongoose";

export interface IUserModel extends IUser, Document {
    generateHash(password: string): string;
    validatePassword(password: string): boolean;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    githubToken: {
        type: String,
        select: false
    }
});

const User: Model<IUserModel> = model<IUserModel>("User", userSchema);

export { User };