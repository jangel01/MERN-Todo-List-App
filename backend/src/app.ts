import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import todosRoutes from "./routes/todos";
import sectionsRoutes from "./routes/sections"
import tasksRoutes from "./routes/tasks"
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import userRoutes from "./routes/users";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/todos", todosRoutes);
app.use("/api/sections", sectionsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({error: errorMessage});
});

export default app;