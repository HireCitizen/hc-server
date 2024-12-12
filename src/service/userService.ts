import mysql from 'mysql2/promise';

import mysqlConnectionProps from "@/db/database";
import { Org, User } from "@/types/User";
import { RowDataPacket } from "mysql2";

export async function getPrimaryUserById(id: number): Promise<User> {
  try {
    const conn = await mysql.createConnection(mysqlConnectionProps);
    const [rows] = await conn.query<RowDataPacket[]>(`
      SELECT u.*, po.id AS player_org_id, po.name as player_org_name, po.spectrum_id, po.spectrum_link as spectrum_link, po.description AS player_org_description
      FROM user u
      LEFT JOIN player_org_user_join pojoin ON u.id = pojoin.user_id
      LEFT JOIN player_org po ON pojoin.player_org_id = po.id
      WHERE u.id = ?
    `, [id]);

    const {player_org_id, spectrum_id, player_org_description, player_org_name, spectrum_link, ...baseUser} = rows[0];

    const user = {
      ...baseUser,
      orgs: [
        {
          id: player_org_id,
          name: player_org_name,
          spectrum_id,
          spectrum_link: spectrum_link,
          description: player_org_description
        }
      ]
    } as User;

    await conn.end();
    return user;

  } catch (error) {
    console.error("Error getting user by id", error);
    throw error;
  }
};

