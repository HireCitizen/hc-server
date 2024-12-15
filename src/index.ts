import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import home from "@/routes/homeController";
import users from "@/routes/userController";
import jobs from "@/routes/jobController";

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
