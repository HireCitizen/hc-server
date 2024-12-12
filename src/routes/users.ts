import express, { Request, Response } from "express";
const router = express.Router();

router.get('/:id', (req: Request, res: Response) => {
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
    language: {
      code: 'EN',
      name: 'English'
    },
    reputation: 5
  });
});

export default router;
