import { app, port } from "./app";
import mongoose from "mongoose";

let dbUrl = "";


(process.env.DB_URL)
    ? dbUrl = process.env.DB_URL
    : dbUrl = "mongodb://mongo:27017/techgames";

console.log(dbUrl);

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.set("useCreateIndex", true);

const server = app.listen(port, async () => {
    console.log(`Server listening on port ${port} ...`);
});

export { server };
