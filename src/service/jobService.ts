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
  const [jobRow] = await conn.query<RowDataPacket[]>(
    `SELECT * FROM job WHERE id = ?`, [jobId]
  );

  if (jobRow.length === 1) {
    const jobId = jobRow[0].id;

    const [crewRoleJoinRows] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM job_crew_role_join WHERE job_id = ?`, [jobId]
    );

    const crewRoles = crewRoleJoinRows.map((row) => ({
      id: row.crew_role_id,
      count: row.crew_role_count
    }));

    const crewRoleData = await Promise.all(crewRoles.map(async (crewRole) => {
      const [crewRoleRow] = await conn.query<RowDataPacket[]>(
        `SELECT * FROM crew_roles WHERE id = ?`, [crewRole.id]
      );
      return {
        ...crewRoleRow[0],
        count: crewRole.count
      } as CrewRole;
    }));

    await conn.end();
    return { ...jobRow[0], crewRoles: crewRoleData } as Job;
  }

  await conn.end();
  return {} as Job;
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

  console.log('roleResp', roleResp);

  console.log('final role rows', roleRows);
  console.log('final job', row);
  await conn.end();
  return {} as Job;
}
