import mysql from 'mysql2/promise';

import mysqlConnectionProps from "@/db/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { CrewRole, Job, JobType, JobTypeCategory } from '@/types/Job';
import { User, UserLanguage } from '@/types/User';
import { FormData } from '@/types/Forms';

export async function searchJobs({
  searchTerm,
  filter
}: {
  searchTerm?: string;
  filter?: string[];
}): Promise<Job[]> {

  try {
    const conn = await mysql.createConnection(mysqlConnectionProps);

    if (searchTerm && searchTerm.length > 0) {
      const [rows] = await conn.query<RowDataPacket[]>(
        `SELECT j.*,
         u.id AS user_id, u.moniker,
         jt.id as jobtype_id, jt.name AS job_type_name, jt.description AS job_type_description,
         l.code AS language_code, l.name AS language_name
         FROM job j
         LEFT JOIN user u ON j.owner_id = u.id
         LEFT JOIN job_type jt ON j.job_type_id = jt.id
         LEFT JOIN language l ON j.language_id = l.id
         WHERE j.title LIKE ?`,
        [`%${searchTerm}%`]
      );

      const jobs = rows.map(row => ({
        ...row,
        owner: {
          id: row.user_id,
          moniker: row.moniker
        } as User,
        jobType: {
          id: row.jobtype_id,
          name: row.job_type_name,
          description: row.job_type_description
        } as JobType,
        language: {
          code: row.language_code,
          name: row.language_name
        } as UserLanguage
      }));

      await conn.end();
      return jobs as Job[];

    } else {
      return [] as Job[];
    }

  } catch (error) {
    console.error("Error searching jobs", error);
    throw error;
  }
}

export async function getJobById(jobId: number): Promise<Job> {
  const conn = await mysql.createConnection(mysqlConnectionProps);
  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT j.*,
      cr.name AS crew_role_name, cr.description AS crew_role_description, cr.id AS crew_role_id,
      jcr.crew_role_count,
      jt.name AS job_type_name, jt.description AS job_type_description,
      l.code AS language_code, l.name AS language_name,
      u.moniker AS user_moniker
      FROM job j
      LEFT JOIN job_crew_role_join jcr ON j.id = jcr.job_id
      LEFT JOIN crew_roles cr ON jcr.crew_role_id = cr.id
      LEFT JOIN job_type jt ON j.job_type_id = jt.id
      LEFT JOIN language l ON j.language_id = l.id
      LEFT JOIN user u ON j.owner_id = u.id
      WHERE j.id = ?`,
    [jobId]
  );

  console.log('rows', rows);
  if (rows.length > 0) {
    const jobData = rows[0];
    const crewRoles = rows.map(row => ({
      id: row.crew_role_id,
      name: row.crew_role_name,
      description: row.crew_role_description,
      count: row.crew_role_count
    })) as CrewRole[];

    await conn.end();
    return {
      id: jobData.id,
      owner: {
        id: jobData.owner_id,
        moniker: jobData.user_moniker
      },
      title: jobData.title,
      description: jobData.description,
      jobType: {
        id: jobData.job_type_id,
        name: jobData.job_type_name,
        description: jobData.job_type_description
      },
      status: jobData.status,
      created_at: jobData.created_at,
      updated_at: jobData.updated_at,
      job_start: jobData.job_start,
      estimated_time: jobData.estimated_time,
      amount_paid: jobData.amount_paid,
      pay_type: jobData.pay_type,
      reputation_gate: jobData.reputation_gate,
      language: {
        id: jobData.language_id,
        code: jobData.language_code,
        name: jobData.language_name
      },
      job_privacy: jobData.job_privacy,
      crewRoles
    } as unknown as Job;

  } else {
    await conn.end();
    return {} as Job;
  }
}

export async function getJobCategories(): Promise<JobTypeCategory[]> {
  try {
    const conn = await mysql.createConnection(mysqlConnectionProps);
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM job_type`
    );
    await conn.end();
    return rows as JobTypeCategory[];

  } catch (error) {
    console.error("Error getting job categories", error);
    throw error;
  }
}

export async function getCrewRoles(): Promise<CrewRole[]> {
  try {
    const conn = await mysql.createConnection(mysqlConnectionProps);
    const [rows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM crew_roles`
    );
    await conn.end();
    return rows as CrewRole[];

  } catch (error) {
    console.error("Error getting crew roles", error);
    throw error;
  }
}

export async function createJob(job: FormData): Promise<Job> {
  const conn = await mysql.createConnection(mysqlConnectionProps);

  const [row] = await conn.query<ResultSetHeader>(
    `INSERT INTO job (owner_id, title, description, job_type_id, language_id, status, job_start, estimated_time, amount_paid, pay_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [1, job.title, job.description, job.jobType, 1, 'PENDING', new Date(job.jobStart), job.estimatedTime, job.amountPaid, job.payType, new Date(), new Date()]
  );

  const jobId = row.insertId;
  const roleRows: ResultSetHeader[] = [];

  const roleResp = await Promise.all(job.crewRoles.map((crewRole) => {
    return conn.query<ResultSetHeader>(
        `INSERT INTO job_crew_role_join (job_id, crew_role_id, crew_role_count) VALUES (?, ?, ?)`,
        [jobId, crewRole.id, crewRole.count]
    );
  }));
  // return job
  await conn.end();
  return {} as Job;
}
