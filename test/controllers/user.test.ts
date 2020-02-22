import mongoose from "mongoose";
import chaiHttp from "chai-http";
import chaiAsPromised from "chai-as-promised";
import chai, {expect} from "chai";
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
            const { body } = await chai.request(app).get("/users/akjlhdsakjhd");
            const expectedBody = {
                status: 422,
                message: "params[userId]: Invalid or missing ':userId'"
            };

            expect(body).to.deep.equal(expectedBody);
        });

        it ("status 200: returns user with corresponding userID", async () => {
            const res = await chai.request(app).get(`/users/${testUser._id}`);
            expect(res.body.email).to.equal(testUser.email);
            expect(res.status).to.equal(200);

        });

        it ("status 404: returns an appropriate error message if userID is not found in database", async () => {
            const { body: user } = await chai.request(app).get(`/users/507f1f77bcf86cd799439011`);
            const expectedBody = {
                status: 404,
                message: "User not found"
            }
            expect(user).to.deep.equal(expectedBody);
        })
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

    describe("POST /users/:userId/updateScore", () => {

        it("status 422: returns an appropriate error message if userId isn't a mongoId", async () => {
            const { body: score } = await chai.request(app).post("/users/1/updateScore");
            const expectedBody = {
                status: 422,
                message: "params[userId]: Invalid or missing ':userId'"
            };

            expect(score).to.deep.equal(expectedBody);
        });

        it("status 404: returns an appropriate error message if userId does not exist", async () => {
            const testScore = {
                liveness: true,
                indexArticles: true,
                showArticles200: true,
                showArticles400: true,
                showArticles404: true,
                createArticles200: true,
                createArticles400: true,
                updateArticles200: true,
                updateArticles400: true,
                updateArticles404: true,
                deleteArticles200: true,
                deleteArticles400: true,
                deleteArticles404: true,
            }
            const { body: score } = await chai.request(app).post("/users/507f1f77bcf86cd799439011/updateScore").send(testScore);   
            
            const expectedBody = {
                status: 404,
                message: "User not found"
            };

            expect(score).to.deep.equal(expectedBody);
        });

        it("status 200: returns a user after successful creation", async () => {
            const testScore = {
                liveness: true,
                indexArticles: true,
                showArticles200: true,
                showArticles400: true,
                showArticles404: true,
                createArticles200: true,
                createArticles400: true,
                updateArticles200: true,
                updateArticles400: true,
                updateArticles404: true,
                deleteArticles200: true,
                deleteArticles400: true,
                deleteArticles404: true,
            }
            const { body: score } = await chai.request(app).post("/users/" + testUser._id + "/updateScore").send(testScore);
            const user: IUserModel = await userDBInteractions.find(testUser._id);
            console.log(user);
            console.log(score);
            expect(user.scores).to.have.length.above(0);
            expect(user.scores[0].toString()).to.equal(score._id);
            expect(score.timestamp).to.exist;
        });
    })

    describe("PUT /users/userId", () => {
        it("status 422: returns an appropriate error message if userId isn't a mongoId", async () => {
            const { body: user } = await chai.request(app).put("/users/1");
            const expectedBody = {
                status: 422,
                message: "params[userId]: Invalid or missing ':userId'"
            };

            expect(user).to.deep.equal(expectedBody);
        });

        it("status 404: returns an appropriate error message if userId does not exist", async () => {
            const { body: user } = await chai.request(app).put("/users/507f1f77bcf86cd799439011")
            .send({ email: "example1@gmail.com" })
            .send({ githubRepo: "https://github.com/CompeteMcgill/challenge-template_new" })
            .send({ githubToken: "token_new" })
            .send({ githubUsername: "example_new" })
            .send({ scores: [] });     
            
            const expectedBody = {
                status: 404,
                message: "User not found"
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

        it("status 422: returns an appropriate error message if githubUsername isn't a string", async () => {
            const { body: user } = await chai.request(app).put("/users/" + testUser._id).send({ githubUsername: 1 });
            const expectedBody = {
                status: 422,
                message: "body[githubUsername]: Invalid or missing 'githubUsername'"
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

        it("status 200: updates a user email", async () => {
            const { body: updatedUser } = await chai.request(app).put("/users/" + testUser._id)
            .send({ email: "example1@gmail.com" })
            .send({ githubRepo: "https://github.com/CompeteMcgill/challenge-template_new" })
            .send({ githubToken: "token_new" })
            .send({ githubUsername: "example_new" })
            .send({ scores: [] });     
                
            const foundUser: IUserModel = await userDBInteractions.find(testUser._id);

            expect(updatedUser.email).to.equal("example1@gmail.com");
            expect(updatedUser.githubRepo).to.equal("https://github.com/CompeteMcgill/challenge-template_new");
            expect(updatedUser.githubToken).to.equal("token_new");
            expect(updatedUser.githubUsername).to.equal("example_new");
            expect(updatedUser.scores).to.deep.equal(testUser.scores);

            expect(foundUser.email).to.equal("example1@gmail.com");
            expect(foundUser.githubRepo).to.equal("https://github.com/CompeteMcgill/challenge-template_new");
            expect(foundUser.githubToken).to.equal("token_new");
            expect(foundUser.githubUsername).to.equal("example_new");
            expect(foundUser.scores).to.deep.equal(testUser.scores);
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

        it("status 404: returns an appropriate error message if userId is not found", async () => {
            const { body: user } = await chai.request(app).delete('/users/507f1f77bcf86cd799439011');
            const expectedBody = {
                status: 404,
                message: "User not found"
            }

            expect(user).to.deep.equal(expectedBody);
        });
        
        it("status 200: returns successfully deleted user by its userId", async () => {
            const userBeforeDelete = await userDBInteractions.find(testUser._id);
            expect(userBeforeDelete).to.not.be.null;
            const res = await chai.request(app).delete("/users/" + testUser._id);
            expect(res.status).to.equal(200);
            const userAfterDelete = await userDBInteractions.find(testUser._id);  
            expect(userAfterDelete).to.be.null;
        });
    });
});