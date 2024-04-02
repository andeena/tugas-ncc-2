const {createPool} = require('mysql');

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'coba_api_ncc',
    connectionLimit: 10
});

// connection.connect((err) => {
//     if (err) throw err;
//     console.log('MySQL Connected to root@localhost in coba_api_ncc Database')
// });

module.exports = pool;