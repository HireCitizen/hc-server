import express, { Request, Response } from "express";
const router = express.Router();

import { getPrimaryUserById } from "@/service/userService";

router.get('/:id', async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  if (!userId || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  const user = await getPrimaryUserById(userId);
  res.json(user);
});

export default router;
