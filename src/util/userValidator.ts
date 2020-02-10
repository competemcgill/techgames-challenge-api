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
                body("githubToken", "Invalid 'githubToken'").optional().isString()
            ];
        }
        case "POST /users/:userId/updateScore": {
            return [
                param("userId", "Invalid or missing ':userId'").exists().isMongoId(),
                body("liveness", "Invalid or missing 'liveness'").exists().isBoolean(),
                body("authenticate200", "Invalid or missing 'authenticate200'").exists().isBoolean(),
                body("authenticate403", "Invalid or missing 'authenticate403'").exists().isBoolean(),
                body("createAccount201", "Invalid or missing 'createAccount201'").exists().isBoolean(),
                body("createAccount400", "Invalid or missing 'createAccount400'").exists().isBoolean(),
                body("createAccount500", "Invalid or missing 'createAccount500'").exists().isBoolean(),
                body("indexArticles", "Invalid or missing 'indexArticles'").exists().isBoolean(),
                body("showArticles200", "Invalid or missing 'showArticles200'").exists().isBoolean(),
                body("showArticles404", "Invalid or missing 'showArticles404'").exists().isBoolean(),
                body("createArticles201", "Invalid or missing 'createArticles201'").exists().isBoolean(),
                body("createArticles400", "Invalid or missing 'createArticles400'").exists().isBoolean(),
                body("createArticles403", "Invalid or missing 'createArticles403'").exists().isBoolean(),
                body("updateArticles200", "Invalid or missing 'updateArticles200'").exists().isBoolean(),
                body("updateArticles400", "Invalid or missing 'updateArticles400'").exists().isBoolean(),
                body("updateArticles401", "Invalid or missing 'updateArticles401'").exists().isBoolean(),
                body("updateArticles403", "Invalid or missing 'updateArticles403'").exists().isBoolean(),
                body("updateArticles404", "Invalid or missing 'updateArticles404'").exists().isBoolean(),
                body("deleteArticles200", "Invalid or missing 'deleteArticles200'").exists().isBoolean(),
                body("deleteArticles401", "Invalid or missing 'deleteArticles401'").exists().isBoolean(),
                body("deleteArticles403", "Invalid or missing 'deleteArticles403'").exists().isBoolean(),
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