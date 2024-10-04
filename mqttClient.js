const mqtt = require('mqtt');
const db = require('./db');
const client = mqtt.connect('mqtt://172.6.0.240:1883');

client.on('connect', () => {
    client.subscribe('sensor/data');
    client.subscribe('control/movement');
});

client.on('message', (topic, message) => {
    if (topic === 'sensor/data') {
        const [temperature, pressure, depth] = message.toString().split(',');
        db.query(
            'INSERT INTO sensor_data (temperature, pressure, depth) VALUES (?, ?, ?)',
            [temperature, pressure, depth],
            (err) => {
                if (err) throw err;
                console.log('Sensor data saved');
            }
        );
    } else if (topic === 'control/movement') {
        db.query('INSERT INTO control_logs (action) VALUES (?)', [message.toString()], (err) => {
            if (err) throw err;
            console.log('Control action logged');
        });
    }
});

module.exports = client;
