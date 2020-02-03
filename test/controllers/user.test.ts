import mongoose from "mongoose";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import chai, { expect } from "chai";
import { bcryptPassword } from "../../src/util/bcrypt";
import { app, port } from "../../src/app";
import { User, IUserModel } from "../../src/database/models/user";
import { IUser } from "../../src/interfaces/user";
import { userDBInteractions } from "../../src/database/interactions/user";

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
            password: bcryptPassword.generateHash("password"),
            githubToken: "token"
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
        it("status 422: returns an appropriate error message if email isn't provided", async () => {
            const testUserData = {
                password: "password",
                githubToken: "token"
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
                password: "password",
                githubToken: "token"
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
                password: "password",
                githubToken: "token"
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[email]: Invalid or missing 'email'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if password isn't provided", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                githubToken: "token"
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[password]: Invalid or missing 'password'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if password isn't a string", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                password: 1,
                githubToken: "token"
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[password]: Invalid or missing 'password'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if githubToken isn't provided", async () => {
            const testUserData = {
                email: "example1@gmail.com",
                password: "password"
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
                password: "passowrd",
                githubToken: 1
            };

            const { body: user } = await chai.request(app).post("/users").send(testUserData);
            const expectedBody = {
                status: 422,
                message: "body[githubToken]: Invalid or missing 'githubToken'"
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

        it("status 422: returns an appropriate error message if password isn't a string", async () => {
            const { body: user } = await chai.request(app).put("/users/" + testUser._id).send({ password: 1 });
            const expectedBody = {
                status: 422,
                message: "body[password]: Invalid 'password'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 422: returns an appropriate error message if githubToken isn't a string", async () => {
            const { body: user } = await chai.request(app).put("/users/" + testUser._id).send({ githubToken: 1 });
            const expectedBody = {
                status: 422,
                message: "body[githubToken]: Invalid 'githubToken'"
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