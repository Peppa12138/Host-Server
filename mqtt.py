import paho.mqtt.client as mqtt
import random
import time
import threading
import json

# MQTT服务器设置
broker = "172.6.0.240"  # MQTT代理地址
port = 1883  # MQTT代理端口
topic_sensor = "sensor/data"
topic_control = "control/movement"

# 传感器值
temperature = 0.0
pressure = 0.0
depth = 0.0


def publish_sensor_data():
    global temperature, pressure, depth
    client = mqtt.Client()
    client.connect(broker, port)

    while True:
        # 模拟传感器数据
        temperature = round(random.uniform(15.0, 30.0), 2)  # 温度范围 15-30℃
        pressure = round(random.uniform(95.0, 105.0), 2)  # 气压范围 95-105 KPa
        depth = round(random.uniform(0.0, 10.0), 2)  # 深度范围 0-10 M

        # 使用 JSON 格式发布传感器数据，任务布置时给出的参考代码格式与实现时的格式不匹配，已修改为json格式
        payload = json.dumps({
            "temperature": temperature,
            "pressure": pressure,
            "depth": depth
        })
        # print(f"Publishing sensor data: {payload}")
        client.publish(topic_sensor, payload)
        print(f"Published: {payload}")
        time.sleep(10)


def on_message(client, userdata, msg):
    try:
        # 解析控制信号
        payload = json.loads(msg.payload.decode())
        action = payload.get("action", "UNKNOWN")
        print(f"Received action: {action} on topic {msg.topic}")
        # 根据 action 执行相应的操作
    except json.JSONDecodeError:
        print("Received invalid JSON format")


def on_disconnect(client, userdata, rc):
    print("Disconnected, trying to reconnect...")
    client.reconnect()


def subscribe_control_signals():
    client = mqtt.Client()
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    client.connect(broker, port)
    client.subscribe(topic_control)
    client.loop_start()  # 启动循环以接收消息

    while True:
        time.sleep(10)  # 等待接收信号


if __name__ == "__main__":
    sensor_thread = threading.Thread(target=publish_sensor_data)
    sensor_thread.start()
    subscribe_control_signals()
