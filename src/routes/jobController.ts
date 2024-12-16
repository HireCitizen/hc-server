import express, { Request, Response } from "express";
const router = express.Router();

import { createJob, getCrewRoles, getJobById, getJobCategories, searchJobs } from "@/service/jobService";
import { Job } from "@/types/Job";

router.get('/', async (req: Request, res: Response) => {
  const jobs = await searchJobs({
    searchTerm: req.query.searchTerm as string,
    filter: req.query.filter as string[]
  });
  res.json(jobs);
});

router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await getJobCategories();
    res.json(categories);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error });
  }
});

router.get('/job/:id', async (req: Request, res: Response) => {
  const jobId = parseInt(req.params.id);

  if (isNaN(jobId)) {
    res.status(400).json({ error: 'Invalid job ID' });
    return;
  }

  const job = await getJobById(jobId);
  res.json(job);
});

router.get('/crew-roles', async (req: Request, res: Response) => {
  try {
    const crewRoles = await getCrewRoles();
    res.json(crewRoles);

  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error });
  }
});

router.post('/create', async (req: Request, res: Response) => {
  const job: Job = await createJob(req.body);
  res.json(job);
});

export default router;
