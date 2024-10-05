const express = require('express');
const db = require('../db');
const { publishControl } = require('../mqttClient');
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

router.post('/control', (req, res) => {
    const { action } = req.body;

    if (!action) {
        return res.status(400).send({ error: '需要传入 action' });
    }

    publishControl(action);

    db.query('SELECT * FROM sensor_data', (err, results) => {
        if (err) throw err;
        console.log(results);
        res.json(results);
    });
});
module.exports = router;
