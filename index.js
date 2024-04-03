const express = require("express");
const app = express();
const dbconnection = require('./connection');
const PORT = 3000;

app.use(express.json());

// db dummy
const db = [
    {
        id: 1, 
        nama: "Andina",
        asal: "Sidoarjo",
        angkatan: 2022,
        gender: true, // true cewe
        nrp: 12345
    },
    {
        id: 2,
        nama: "Kafin",
        asal: "Jakarta",
        angkatan: 2022,
        gender: false, // false cowo
        nrp: 67890
    }
];

// const dbconnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'coba_api_ncc',
//     // connectionLimit: 10
// });

// dbconnection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to database: ' + err.stack);
//       return;
//     }
//     console.log('Connected to database as id ' + dbconnection.threadId);
//   });



// middleware untuk validasi
const validateData = (req, res, next) => {
    const { nama, asal, angkatan, gender, nrp } = req.body;

    if (!nama && !asal && !angkatan && gender === undefined && !nrp) {
        return res.status(400).json({ errors: { message: 'At least one field to update is required' } });
    }

    if (gender !== undefined && typeof gender !== 'boolean') {
        return res.status(400).json({ errors: { message: 'Gender must be a boolean' } });
    }

    next();
};


// GET All Data
app.get("/db", (req, res) => {
    res.status(200).json({ data: db });
});

// GET data MySQL
app.get("/dbmysql", (req, res) => {
    const querysql = 'SELECT * FROM mahasiswa';

    dbconnection.query(querysql, (err, rows, fields) => {
        if (err) {
            return res.status(500).json({ errors: { message: 'There is an error', error: err } });
        }

        res.status(200).json({ data: rows });
    });
});

// GET Data by ID
// app.get("/dbmysql/:id", (req, res) => { 
//     const id = parseInt(req.params.id);
//     const querysql = 'SELECT * FROM mahasiswa WHERE id = ?';
//     const data = dbmysql.find(item => item.id === id);

//     if (!data) {
//         return res.status(404).json({ errors: { message: 'Data not found' } });
//     }

//     res.status(200).json({ data });
// });

// GET data pake ID
app.get("/dbmysql/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const querysql = 'SELECT * FROM mahasiswa WHERE id = ?'; // untuk mendapatkan data berdasarkan ID
    dbconnection.query(querysql, [id], (err, rows, fields) => { // jalankan query dengan parameter ID
        if (err) {
            return res.status(500).json({ errors: { message: 'There is an error', error: err } });
        }
        if (rows.length === 0) {
            return res.status(404).json({ errors: { message: 'Data not found' } });
        }
        res.status(200).json({ data: rows[0] }); // mengembalikan data pertama dari hasil query
    });
});

// CREATE data baru
app.post("/dbmysql", validateData, (req, res) => {
    const { nama, asal, angkatan, gender, nrp } = req.body;
    const query = `INSERT INTO mahasiswa (nama, asal, angkatan, gender, nrp) VALUES (?, ?, ?, ?, ?)`;
    const values = [nama, asal, angkatan, gender, nrp];

    dbconnection.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ errors: { message: 'Failed to create data', error: err } });
        }

        const newData = { id: result.insertId, nama, asal, angkatan, gender, nrp };
        res.status(201).json({ data: newData });
    });
});


// UPDATE data berdasar id nya
app.put("/dbmysql/:id", validateData, (req, res) => {
    const id = req.params.id;
    const { nama, asal, angkatan, gender, nrp } = req.body;
    const query = `UPDATE mahasiswa SET nama=?, asal=?, angkatan=?, gender=?, nrp=? WHERE id=?`;
    const values = [nama, asal, angkatan, gender, nrp, id];

    dbconnection.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ errors: { message: 'Failed to update data', error: err } });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ errors: { message: 'Data not found' } });
        }

        const updatedData = { nama, asal, angkatan, gender, nrp };
        res.status(200).json({ data: updatedData });    });
});


// DELETE data berdasar id nya
app.delete("/dbmysql/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM mahasiswa WHERE id = ?';

    dbconnection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ errors: { message: 'Failed to delete data', error: err } });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ errors: { message: 'Data not found' } });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    });
});


app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
