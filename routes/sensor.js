// const express = require('express');
// const db = require('../db');
// const { publishControl } = require('../mqttClient');
// const router = express.Router();

// router.get('/data', (req, res) => {
//     db.query('SELECT * FROM sensor_data', (err, results) => {
//         if (err) throw err;
//         res.json(results);
//     });
// });

// router.get('/logs', (req, res) => {
//     db.query('SELECT * FROM control_logs', (err, results) => {
//         if (err) throw err;
//         res.json(results);
//     });
// });

// router.post('/control', (req, res) => {
//     const { action } = req.body;

//     if (!action) {
//         return res.status(400).send({ error: '需要传入 action' });
//     }

//     publishControl(action);

//     db.query('SELECT * FROM sensor_data', (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         res.json(results);
//     });
// });
// module.exports = router;
const express = require("express");
const db = require("../db");
const { publishControl } = require("../mqttClient");
const router = express.Router();

// 获取传感器数据
router.get("/data", (req, res) => {
  db.query("SELECT * FROM sensor_data", (err, results) => {
    if (err) {
      console.error("获取传感器数据时发生错误:", err);
      return res.status(500).send({ error: "服务器错误" });
    }
    res.json(results);
  });
});

// 获取控制日志
router.get("/logs", (req, res) => {
  db.query("SELECT * FROM control_logs", (err, results) => {
    if (err) {
      console.error("获取控制日志时发生错误:", err);
      return res.status(500).send({ error: "服务器错误" });
    }
    res.json(results);
  });
});

// 发布控制命令
router.post("/control", (req, res) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).send({ error: "需要传入 action" });
  }

  // 发布控制信号
  publishControl(action);

  // 返回操作已成功的响应
  res.status(200).send({ message: "控制命令已发送" });
});

module.exports = router;
