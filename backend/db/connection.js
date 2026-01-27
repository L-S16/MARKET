const mysql = require('mysql2');    //npm install mysql2

let connection = {}
//mysql://b6610f3663d3ed:7507053f@us-cdbr-east-04.cleardb.com/heroku_b0601f717a83a2a?reconnect=true

//Base de datos local
connection.pool = () => {
    return mysql.createPool({
        connectionLimit : 10,
        host: 'centerbeam.proxy.rlwy.net',
        port: '3306',
        user: 'root',
        password: 'WlKBYbxIIRNcwKCjJhIrEjxWjcnuKuhy',
        database: 'railway',
        debug: false,
    });
}

module.exports = connection;