import mongoose from "mongoose";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import chai, { expect } from "chai";
import { bcryptPassword } from "../../src/util/bcrypt";
import { app, port } from "../../src/app";
import { User, IUserModel } from "../../src/database/models/user";
import { IUser } from "../../src/interfaces/user";
import { userDBInteractions } from "../../src/database/interactions/user";
import { AssertionError } from "assert";

chai.use(chaiHttp);
chai.use(chaiAsPromised);

let server: import("http").Server;
let testUser: IUserModel;

describe("User controller tests", () => {
    before(async () => {
        await mongoose.connect("mongodb://mongo:27017/techgames_test", {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        await User.deleteMany({});
        server = app.listen(port);
    });

    beforeEach(async () => {
        const testUserData: IUser = {
            email: "example@gmail.com",
            githubToken: "token",
            githubUsername: "example",
            githubRepo: "https://github.com/CompeteMcgill/challenge-template",
            scores: []
        };

        testUser = await userDBInteractions.create(testUserData);
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    after(async () => {
        await mongoose.disconnect();
        server.close();
    });

    describe("GET /users", () => {
        it("status 200: returns successfully a list of 1 user", async () => {
            const {body : users} = await chai.request(app).get("/users");
            expect(users.length).to.equal(1);
            expect(users[0].email).to.equal(testUser.email);
        });
        it("status 200: returns successfully a list of multiple users", async () => {
            const newTestUserData: IUser = {
                email: "instance@gmail.com",
                githubToken: "newToken",
                githubUsername: "newExample",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template2",
                scores: []
            };
    
            const newTestUser = await userDBInteractions.create(newTestUserData);
            const {body : users} = await chai.request(app).get("/users");
            const expectedBody =  await userDBInteractions.all();
            expect(users.length).to.equal(2);
            expect(users[0].email).to.equal(expectedBody[0].email);
            expect(users[1].email).to.equal(expectedBody[1].email);
        });
    });

    describe("GET /users/:userId", () => {
        it("status 422: returns an appropriate error message if userId isn't a mongoId", async () => {
            const { body: user } = await chai.request(app).get("/users/akjlhdsakjhd");
            const expectedBody = {
                status: 422,
                message: "params[userId]: Invalid or missing ':userId'"
            };

            expect(user).to.deep.equal(expectedBody);
        });
    });

    describe("POST /users", () => {
        it("status 200: returns a user after successful creation", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                githubToken: "token",
                githubUsername: "example1",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            }

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const foundUser: IUserModel = await userDBInteractions.find(user._id);

            expect(foundUser.email).to.equal("example1@gmail.com");
            expect(foundUser.githubRepo).to.equal("https://github.com/example1/techgames-api-challenge-template");
        });

        it("status 400: returns an appropriate error message if user email is in use", async () => {
            const testUserData = {
                email: "example@gmail.com",
                githubToken: "token",
                githubUsername: "example1",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            }

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 400,
                message: "User already exists"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if email isn't provided", async () => {
            const testUserData = {
                githubToken: "token",
                githubUsername: "example",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[email]: Invalid or missing 'email'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if email isn't an email", async () => {
            const testUserData = {
                email: "not and email",
                githubToken: "token",
                githubUsername: "example",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[email]: Invalid or missing 'email'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if email isn't a string", async () => {
            const testUserData = {
                email: 1,
                githubToken: "token",
                githubUsername: "example",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[email]: Invalid or missing 'email'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if githubToken isn't provided", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                githubUsername: "example",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[githubToken]: Invalid or missing 'githubToken'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if githubToken isn't a string", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                githubToken: 1,
                githubUsername: "example",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[githubToken]: Invalid or missing 'githubToken'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if githubUsername isn't provided", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                githubToken: "token",
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[githubUsername]: Invalid or missing 'githubUsername'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if githubUsername isn't a string", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                githubToken: "token",
                githubUsername: 1,
                githubRepo: "https://github.com/CompeteMcgill/challenge-template",
                scores: []
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[githubUsername]: Invalid or missing 'githubUsername'"
            };

            expect(user).to.deep.equal(expectedBody);
        });
    });

    describe("PUT /users/userId", () => {
        it("status 422: returns an appropriate error message if userId isn't a mongoId", async () => {
            const { body: user } = await chai.request(app).put("/users/1");
            const expectedBody = {
                status: 422,
                message: "params[userId]: Invalid or missing ':userId'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if email isn't an email", async () => {
            const { body: user } = await chai.request(app).put("/users/" + testUser._id).send({ email: "not an email" });
            const expectedBody = {
                status: 422,
                message: "body[email]: Invalid 'email'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if email isn't an email", async () => {
            const { body: user } = await chai.request(app).put("/users/" + testUser._id).send({ email: "not an email" });
            const expectedBody = {
                status: 422,
                message: "body[email]: Invalid 'email'"
            };

            expect(user).to.deep.equal(expectedBody);
        });
    });

    describe("DELETE /users/userId", () => {
        it("status 422: returns an appropriate error message if userId isn't a mongoId", async () => {
            const { body: user } = await chai.request(app).delete("/users/1");
            const expectedBody = {
                status: 422,
                message: "params[userId]: Invalid or missing ':userId'"
            };

            expect(user).to.deep.equal(expectedBody);
        });
    });
});