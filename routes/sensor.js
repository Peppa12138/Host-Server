const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/data', (req, res) => {
    db.query('SELECT * FROM sensor_data', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

router.get('/logs', (req, res) => {
    db.query('SELECT * FROM control_logs', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = router;
