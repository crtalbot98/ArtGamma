//returns data to db (mysql)
const mysql = require('mysql');

//database connecito for app engine
let config = {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
};

// !! UNCOMMENT LINE 12 WHEN CONNECTING TO CLOUD SQL FROM CLOUD SHELL
config.socketPath = `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`;

// !! UNCOMMENT LINES 15-16 WHEN CONNECTING TO CLOUD SQL FROM CLOUD SHELL
// !! (This will only work if you have created a Cloud SQL proxy as described here: https://codelabs.developers.google.com/codelabs/connecting-to-cloud-sql/index.html?index=..%2F..index#2 )
config.host = '127.0.0.1';
config.port = '3306';

let connection = mysql.createConnection(config);

module.exports = connection;