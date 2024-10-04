const express = require('express'); // 导入 Express
const bodyParser = require('body-parser'); // 导入 body-parser 解析请求体
const cors = require('cors'); // 导入 CORS 中间件
const sensorRoutes = require('./routes/sensor'); // 导入传感器相关的路由
const mqttClient = require('./mqttClient'); // 导入 MQTT 客户端
const app = express(); // 创建 Express 应用程序

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 格式的请求体

// 路由设置
app.use('/api/sensor', sensorRoutes); // 使用传感器路由

// 设置服务器端口
const PORT = process.env.PORT || 5000; // 使用环境变量中的端口或默认使用 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // 启动服务器并输出运行信息
});
