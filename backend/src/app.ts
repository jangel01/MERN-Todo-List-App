import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import todosRoutes from "./routes/todos";
import sectionsRoutes from "./routes/sections"
import tasksRoutes from "./routes/tasks"
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/todos", todosRoutes);
app.use("/api/sections", sectionsRoutes);
app.use("/api/tasks", tasksRoutes)

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