import mysql, {ConnectionOptions} from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connectionOptions: ConnectionOptions = {
  host: process.env.aws_db_host,
  port: Number(process.env.aws_db_port),
  user: process.env.aws_db_username,
  database: process.env.db_name_dev,
  password: process.env.aws_db_password,
  multipleStatements: true,
}

export default connectionOptions;
