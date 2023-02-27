const mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
const pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_loftuscl',
    password        : '3202',
    database        : 'cs340_loftuscl'
})

module.exports.pool = pool;