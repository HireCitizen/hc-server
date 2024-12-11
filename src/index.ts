import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
const app: Express = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req: Request, res: Response) => {
  res.send('hello world')
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
