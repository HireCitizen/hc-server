import mysql, {ConnectionOptions, QueryError} from "mysql2";

const connectionOptions: ConnectionOptions = {
  host: process.env.aws_db_host,
  user: process.env.aws_db_username,
  database: process.env.db_name_dev,
  password: process.env.aws_db_password,
  multipleStatements: true,
}

const mysqlConnection = mysql.createConnection(connectionOptions);

mysqlConnection.connect((err: QueryError | null) => {
  setTimeout(() => {
    if (!err) {
      console.log("Connected");
    } else {
      console.log("Connection Failed");
    }
  }, 3000);

});

export default mysqlConnection;
