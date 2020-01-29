import { Router } from "express";
import { userController } from "../controllers/user";

const userRouter: Router = Router();

/**
 * @swagger
 * /users:
 *  get:
 *      description: Gets all Users
 *      tags:
 *          - Users
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: Returns all Users
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.get("/", userController.index);

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *      description: Gets a specific User
 *      tags:
 *          - Users
 *      parameters:
 *          - in: path
 *            name: userId
 *            description: ID of the User to get
 *            schema:
 *                  type: string
 *                  required: true
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: Returns specific User
 *          404:
 *              description: User with given ID not found
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.get("/:userId", userController.show);

/**
 * @swagger
 * /users:
 *  post:
 *      description: Creates a new User
 *      tags:
 *          - Users
 *      parameters:
 *          - in: body
 *            name: userData
 *            description: email or password of the new User
 *            schema:
 *                type: object
 *                properties:
 *                    email:
 *                        type: string
 *                    password:
 *                        type: integer
 *                example:
 *                    email: "example@gmail.com"
 *                    password: "password"
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Returns new User
 *          400:
 *              description: User already exists
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.post("/", userController.create);

/**
 * @swagger
 * /users/{userId}:
 *  put:
 *      description: Updates a specific User
 *      tags:
 *          - Users
 *      parameters:
 *          - in: path
 *            name: userId
 *            description: ID of the User to update
 *            schema:
 *                type: string
 *                required: true
 *          - in: body
 *            name: userData
 *            description: email or password can be updated
 *            schema:
 *                type: object
 *                properties:
 *                    email:
 *                        type: string
 *                    password:
 *                        type: string
 *                example:
 *                    email: "example@gmail.com"
 *                    password: "password"
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: Returns updated User
 *          404:
 *              description: User not found
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.put("/:userId", userController.update);

/**
 * @swagger
 * /user/{userId}:
 *  delete:
 *      description: Deletes a specific User
 *      tags:
 *          - Users
 *      parameters:
 *           - in: path
 *             name: userId
 *             schema:
 *                 type: string
 *                 required: true
 *             description: ID of the User to delete
 *      produces:
 *          -application/json
 *      responses:
 *          200:
 *              description: User was successfully deleted
 *          422:
 *              description: Validation error
 *          500:
 *              description: Internal server error
 */
userRouter.delete("/:userId", userController.delete);

export { userRouter };