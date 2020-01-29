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
        it("status 200: gets not implemented msg", async () => {
            const { body } = await chai.request(app).get("/users");
            const expectedBody = {
                msg: "Not implemented"
            }

            expect(body).to.deep.equal(expectedBody);
        });
    });
});