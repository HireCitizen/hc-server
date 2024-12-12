import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import mysqlConnection from "./db/database";

import home from "./routes/home";
import users from "./routes/users";
import jobs from "./routes/jobs";
dotenv.config();

const port = process.env.PORT;
const app: Express = express();
app.use(cors())

app.use('/', home);
app.use('/api/user', users);
app.use('/api/jobs', jobs);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
