const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sensorRoutes = require('./routes/sensor');
const mqttClient = require('./mqttClient');
const app = express(); 

app.use(cors());
app.use(bodyParser.json());

app.use('/api/sensor', sensorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
