import mysql from "promise-mysql";
import config from "./../config";

const connection = mysql.createConnection({
    host: config.mysql_settings.host,
    database: config.mysql_settings.database,
    user: config.mysql_settings.user,
    password: config.mysql_settings.password
});

const getConnection = () => {
    return connection;
};

module.exports = {
    getConnection
};
