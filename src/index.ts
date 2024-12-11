import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const port = process.env.PORT;
const app: Express = express();
app.use(cors())

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req: Request, res: Response) => {
  res.send('hello world')
});

app.get('/api/user/:id', (req: Request, res: Response) => {
  res.json({
    id: 1,
    handle: 'doc_mercy',
    moniker: 'Riz "Doc" Mercy',
    email: "david.ryan.hall@gmail.com",
    phone: '18186054161',
    rsi_url: "https://robertsspaceindustries.com/citizens/Doc_Mercy",
    timezone: "PST",
    account_status: 'ACTIVE',
    profile_image: "https://robertsspaceindustries.com/media/6zps1zlnkpojqr/heap_infobox/A1637869310_10.jpg",
    language_code: 'EN',
    reputation: 5
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
