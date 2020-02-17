import { body, param, ValidationChain } from "express-validator/check";

export function userValidator(method: string): ValidationChain[] {
    switch (method) {
        case "GET /users": {
            return [];
        }
        case "GET /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'").exists().isMongoId()
            ];
        }
        case "POST /users": {
            return [
                body("email", "Invalid or missing 'email'").exists().isEmail(),
                body("githubToken", "Invalid or missing 'githubToken'").exists().isString(),
                body("githubUsername", "Invalid or missing 'githubUsername'").exists().isString(),
            ];
        }
        case "PUT /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'").exists().isMongoId(),
                body("email", "Invalid 'email'").optional().isEmail(),
                body("password", "Invalid 'password'").optional().isString(),
                body("githubToken", "Invalid 'githubToken'").optional().isString(),
                body("githubUsername", "Invalid or missing 'githubUsername'").exists().isString()
            ];
        }
        case "POST /users/:userId/updateScore": {
            return [
                param("userId", "Invalid or missing ':userId'").exists().isMongoId(),
                body("liveness", "Invalid or missing 'liveness'").exists().isBoolean(),
                body("indexArticles", "Invalid or missing 'indexArticles'").exists().isBoolean(),
                body("showArticles200", "Invalid or missing 'showArticles200'").exists().isBoolean(),
                body("showArticles400", "Invalid or missing 'showArticles400'").exists().isBoolean(),
                body("showArticles404", "Invalid or missing 'showArticles404'").exists().isBoolean(),
                body("createArticles200", "Invalid or missing 'createArticles200'").exists().isBoolean(),
                body("createArticles400", "Invalid or missing 'createArticles400'").exists().isBoolean(),
                body("updateArticles200", "Invalid or missing 'updateArticles200'").exists().isBoolean(),
                body("updateArticles400", "Invalid or missing 'updateArticles400'").exists().isBoolean(),
                body("updateArticles404", "Invalid or missing 'updateArticles404'").exists().isBoolean(),
                body("deleteArticles200", "Invalid or missing 'deleteArticles200'").exists().isBoolean(),
                body("deleteArticles400", "Invalid or missing 'deleteArticles400'").exists().isBoolean(),
                body("deleteArticles404", "Invalid or missing 'deleteArticles404'").exists().isBoolean(),
            ];
        }
        case "DELETE /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'").exists().isMongoId()
            ];
        }
    }
}