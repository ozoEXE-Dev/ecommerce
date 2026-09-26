import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { dbConnect } from "./config/db_connect.js";
import router from "./routes/index.js";
import { errorHandler } from "./errors/error_handler.js";
import AppError from "./errors/AppError.js";
const app = express();
//database
dbConnect();


//middlewares
app.use(express.json());
if (process.env.NODE_ENV === "devolopment") {
    app.use(morgan("dev"));
}
app.set("query parser","extended");
app.use(router);
app.all("/{*splat}", (req, res) => {
    throw new AppError(404, `route: ${req.originalUrl} is not defined`);
})
app.use(errorHandler);

const server = app.listen(process.env.PORT, () => { console.log("server started: ", process.env.PORT) });

process.on("unhandledRejection", (err) => {
    console.error(`unhandled rejection: ${err}`);
    server.close(() => {
        process.exit(1);
    });
})

process.on("uncaughtException", (err) => {
    console.error(`uncaught exception: ${err}`);
    server.close(() => {
        process.exit(1);
    });
})
