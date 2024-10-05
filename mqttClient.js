const mqtt = require('mqtt');
const db = require('./db');
const broker = 'mqtt://172.6.0.240';
const topicSensor = 'sensor/data';
const topicControl = 'control/movement';

const mqttClient = mqtt.connect(broker);

// 处理接收到的传感器数据
mqttClient.on('message', (topic, message) => {
    if (topic === topicSensor) {
        const data = message.toString().split(', ');
        const status = {
            temperature: parseFloat(data[0].split(': ')[1]),
            pressure: parseFloat(data[1].split(': ')[1]),
            depth: parseFloat(data[2].split(': ')[1]),
        };

        const sql = 'INSERT INTO sensor_data (temperature, pressure, depth) VALUES (?, ?, ?)';
        db.query(sql, [status.temperature, status.pressure, status.depth], (err) => {
            if (err) {
                console.error('保存传感器数据时发生错误:', err);
            } else {
                console.log('传感器数据已保存:', status);
            }
        });
    }
});

// 订阅传感器数据主题
mqttClient.on('connect', () => {
    mqttClient.subscribe(topicSensor, (err) => {
        if (err) {
            console.error('订阅失败:', err);
        } else {
            console.log('已订阅传感器数据主题');
        }
    });
});

// 发布控制命令
function publishControl(action) {
    mqttClient.publish(topicControl, action, (error) => {
        if (error) {
            console.error('发布控制命令时发生错误:', error);
        } else {
            const sql = 'INSERT INTO control_logs (action) VALUES (?)';
            db.query(sql, [action], (err) => {
                if (err) {
                    console.error('记录用户操作时发生错误:', err);
                } else {
                    console.log('用户操作已记录:', action);
                }
            });
        }
    });
}

module.exports = {
    mqttClient,
    publishControl,
};
