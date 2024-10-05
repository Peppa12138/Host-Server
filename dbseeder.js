// dbSeeder.js
const mysql = require('mysql2');
const moment = require('moment');

// 创建数据库连接
const connection = mysql.createConnection({
    host: 'localhost', // 数据库主机
    user: 'root', // 数据库用户名
    password: '123456', // 数据库密码
    database: 'iot_db' // 数据库名
});

// 连接数据库
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

// 生成并插入传感器数据
const insertSensorData = () => {
    const temperature = (Math.random() * (30 - 15) + 15).toFixed(2);
    const pressure = (Math.random() * (105 - 95) + 95).toFixed(2);
    const depth = (Math.random() * (10 - 0) + 0).toFixed(2);
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    const sensorQuery = 'INSERT INTO sensor_data (temperature, pressure, depth, timestamp) VALUES (?, ?, ?, ?)';
    connection.query(sensorQuery, [temperature, pressure, depth, timestamp], (err, results) => {
        if (err) {
            console.error('Error inserting sensor data:', err);
        } else {
            console.log('Inserted sensor data:', { temperature, pressure, depth, timestamp });
        }
    });
};

// 生成并插入日志数据
const insertLogData = (action) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    const logQuery = 'INSERT INTO control_logs (action, timestamp) VALUES (?, ?)';

    connection.query(logQuery, [action, timestamp], (err, results) => {
        if (err) {
            console.error('Error inserting log data:', err);
        } else {
            console.log('Inserted log data:', { action, timestamp });
        }
    });
};

// 主函数，生成数据并插入
const main = () => {
    for (let i = 0; i < 10; i++) {
        insertSensorData(); // 插入 10 条传感器数据
        insertLogData('TEST_ACTION'); // 插入 10 条日志数据，示例操作为 'TEST_ACTION'
    }
    // 关闭数据库连接
    connection.end();
};

// 执行主函数
main();
