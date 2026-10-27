import express from "express";
import "dotenv/config";
import { dbConnect } from "./config/db_connect.js";
import router from "./routes/index.js";
import { errorHandler } from "./errors/error_handler.js";
import AppError from "./errors/AppError.js";
import path from "path";
import cors from "cors";
const app = express();
//database
dbConnect();
//middlewares
app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "uploads")));
app.set("query parser", "extended");
app.use(router);
app.all("/{*splat}", (req, res) => {
    throw new AppError(404, `route: ${req.originalUrl} is not defined`);
});
app.use(errorHandler);
const server = app.listen(process.env.PORT, () => { console.log("server started: ", process.env.PORT); });
process.on("unhandledRejection", (err) => {
    console.error(`unhandled rejection: ${err}`);
    server.close(() => {
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    console.error(`uncaught exception: ${err}`);
    server.close(() => {
        process.exit(1);
    });
});
//# sourceMappingURL=index.js.map