import express, { Request, Response } from "express";
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      title: 'Build a spaceship',
      description: 'Build a spaceship',
      jobType: {
        name: 'construction',
        description: 'Building structures and ships.'
      },
      status: 'PENDING',
      owner: {
        id: 1,
        moniker: 'Riz "Doc" Mercy'
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      jobStart: '2024-01-10',
      estimatedTime: '60:00:00',
      amountPaid: 1000,
      payType: "PERSON",
      language: {
        code: 'EN',
        name: 'English'
      },
      isBookmarked: false,
      isFlagged: false
    }, {
      id: 2,
      title: 'Cargo run from Mictrotech to Pyro IV',
      description: 'I want to run a 1000scu of titanium from Mictrotech to Pyro IV. Looking for loaders and security.',
      jobType: {
        name: 'cargo',
        description: 'Loading and transporting cargo.'
      },
      status: 'PENDING',
      owner: {
        id: 2,
        moniker: 'PidTMS'
      },
      createdAt: '2024-01-04',
      updatedAt: '2024-01-05',
      jobStart: '2024-01-09',
      estimatedTime: '120:00:00',
      amountPaid: 110000,
      payType: "TOTAL",
      language: {
        code: 'EN',
        name: 'English'
      },
      isBookmarked: true,
      isFlagged: false
    }, {
      id: 3,
      title: 'Space ERP',
      description: 'In space, no one can hear you cry.',
      jobType: {
        name: 'roleplay',
        description: 'Roleplaying and story-based missions.'
      },
      status: 'PENDING',
      owner: {
        id: 2,
        moniker: 'PaganRites'
      },
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
      jobStart: '2024-01-11',
      estimatedTime: '05:00:00',
      amountPaid: 100000000,
      payType: "PERSON",
      language: {
        code: 'EN',
        name: 'English'
      },
      isBookmarked: false,
      isFlagged: true
    }
  ]);
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({
    id: 1,
    title: 'Build a spaceship',
    description: 'Build a spaceship',
    jobType: {
      name: 'construction',
      description: 'Building structures and ships.'
    },
    status: 'PENDING',
    owner: {
      id: 1,
      moniker: 'Riz "Doc" Mercy'
    },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    jobStart: '2024-01-10',
    estimatedTime: '60:00:00',
    amountPaid: 1000,
    payType: "PERSON",
    language: {
      code: 'EN',
      name: 'English'
    },
    isBookmarked: false,
    isFlagged: false
  });
});

export default router;
