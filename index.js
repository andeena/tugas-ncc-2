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

// middleware untuk validasi
const validateData = (req, res, next) => {
    const { nama, asal, angkatan, gender } = req.body;

    if (!nama || !asal || !angkatan || gender === undefined || typeof gender !== 'boolean' || !nrp) {
        return res.status(400).json({ errors: { message: 'All fields are required and gender must be a boolean' } });
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
app.get("/dbmysql/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const data = db.find(item => item.id === id);

    if (!data) {
        return res.status(404).json({ errors: { message: 'Data not found' } });
    }

    res.status(200).json({ data });
});

// CREATE data baru
app.post("/dbmysql", validateData, (req, res) => { 
    const { nama, asal, angkatan, gender, nrp } = req.body;
    const newData = {
        id: db.length > 0 ? db[db.length - 1].id + 1 : 1,
        nama,
        asal,
        angkatan,
        gender,
        nrp
    };

    db.push(newData);
    res.status(201).json({ data: newData });
});

// UPDATE data berdasar id nya
app.put("/dbmysql/:id", validateData, (req, res) => { 
    const id = parseInt(req.params.id);
    const { nama, asal, angkatan, gender, nrp } = req.body;
    const index = db.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ errors: { message: 'Data not found' } });
    }

    db[index] = { id, nama, asal, angkatan, gender, nrp };
    res.status(200).json({ data: db[index] });
});

// DELETE data berdasar id nya
app.delete("/dbmysql/:id", (req, res) => { 
    const id = parseInt(req.params.id);
    const index = db.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({ errors: { message: 'Data not found' } });
    }

    db.splice(index, 1);
    res.status(200).json({ message: 'Data deleted successfully' });
});

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));
