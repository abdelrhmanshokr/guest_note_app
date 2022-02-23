const dotenv = require('dotenv');

dotenv.config();

const {PORT, HOST, HOST_URL, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER} = process.env;
const SQL_ENCRYPT = process.env.SQL_ENCRYPT === "true";

module.exports = {
    post: PORT,
    host: HOST,
    url: HOST_URL,
    sql: {
        sql_server: SQL_SERVER,
        sql_database: SQL_DATABASE,
        sql_user: SQL_USER,
        sql_password: SQL_PASSWORD,
        options: {
            enrypt: SQL_ENCRYPT,
            enableArithabort: true,
        }
    }
}