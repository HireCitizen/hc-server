import express, { Request, Response } from "express";
const router = express.Router();

import { getJobById, searchJobs } from "@/service/jobService";

router.get('/', async (req: Request, res: Response) => {
  const jobs = await searchJobs({
    searchTerm: req.query.searchTerm as string,
    filter: req.query.filter as string[]
  });
  res.json(jobs);
});

router.get('/:id', async (req: Request, res: Response) => {
  const jobId = parseInt(req.params.id);

  if (isNaN(jobId)) {
    res.status(400).json({ error: 'Invalid job ID' });
    return;
  }

  const job = await getJobById(jobId);
  res.json(job);
});

export default router;
