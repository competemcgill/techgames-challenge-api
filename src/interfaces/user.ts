import {IScore} from "./score"

export interface IUser {
    email: string;
    githubToken: string;
    githubUsername: string;
    githubRepo: string;
    scores: IScore[];
}