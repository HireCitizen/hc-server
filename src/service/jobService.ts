import mysql from 'mysql2/promise';

import mysqlConnectionProps from "@/db/database";
import { RowDataPacket } from "mysql2";
import { CrewRole, Job, JobType, JobTypeCategory } from '@/types/Job';
import { User, UserLanguage } from '@/types/User';

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
         jt.id as job_type_id, jt.name AS job_type_name, jt.description AS job_type_description,
         l.code AS language_code, l.name AS language_name
         FROM job j
         LEFT JOIN user u ON j.owner_id = u.id
         LEFT JOIN job_type jt ON j.job_type = jt.id
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
          id: row.job_type_id,
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
    `SELECT * FROM job WHERE id = ?`, [jobId]
  );

  await conn.end();
  return rows[0] as Job;
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
