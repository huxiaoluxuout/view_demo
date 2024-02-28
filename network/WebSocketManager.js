const heartBeatText = {
    api: "Common/heartbeat",
    token: uni.getStorageSync('token') || ''
};

export class WebSocketManager {
    constructor(url, heartbeatMsg = heartBeatText) {
        this.url = url;
        this.heartbeatMsg = heartbeatMsg; // 使用参数传递心跳信息
        this.socketTask = null;
        this.heartbeatInterval = 30000;
        this.reconnectInterval = 5000;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 50;
        this.onMessageCallback = null;
        this.heartbeatTimer = null; // 用于保存心跳检测的定时器ID
    }

    init() {
        this.connect();
    }

    connect() {
        this.socketTask = uni.connectSocket({
            url: this.url,
            complete: () => {
            }
        });

        this.socketTask.onOpen(() => {
            console.log('WebSocket连接已打开');
            this.heartbeat();
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        });

        this.socketTask.onClose(() => {
            console.log('WebSocket连接已关闭');
            this.stopHeartbeat(); // 停止心跳检测
            if (!uni.getStorageSync('token')) return;
            this.reconnect();
        });

        this.socketTask.onError(() => {
            console.log('WebSocket连接发生错误');
            this.stopHeartbeat(); // 停止心跳检测
            this.reconnect();
        });

        this.socketTask.onMessage((message) => {
            this.onMessage(message);
        });
    }

    setOnMessageCallback(callback) {
        this.onMessageCallback = callback;
    }

    onMessage(message) {
        try {
            const data = JSON.parse(message.data);
            if (this.onMessageCallback) {
                this.onMessageCallback(data);
            }
        } catch (e) {
            console.error('解析消息失败:', e);
        }
    }

    startHeartbeat() {
        if (this.heartbeatTimer !== null) {
            clearInterval(this.heartbeatTimer); // 清除已存在的定时器
        }
        this.heartbeatTimer = setInterval(() => {
            this.heartbeat();
        }, this.heartbeatInterval);
    }

    stopHeartbeat() {
        if (this.heartbeatTimer !== null) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    heartbeat() {
        this.sendMessage(this.heartbeatMsg);
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                console.log(`尝试第${this.reconnectAttempts + 1}次重连`);
                this.connect();
                this.reconnectAttempts++;
            }, this.reconnectInterval);
        } else {
            console.log('达到最大重连次数，不再尝试重连');
        }
    }

    sendMessage(message) {
        if (this.socketTask) {
            const messageText = typeof message === 'object' ? JSON.stringify(message) : message;

            this.socketTask.send({
                data: messageText,
                success: () => {
                    console.log('消息发送成功', message.api);
                },
                fail: () => {
                    console.log('消息发送失败');
                }
            });
        } else {
            console.log('WebSocket连接未开启或已关闭，消息发送失败');
        }
    }

    close() {
        if (this.socketTask) {
            this.stopHeartbeat(); // 关闭连接时停止心跳检测
            this.socketTask.close();
        }
    }

    getConnectionState() {
        return this.socketTask ? 'open' : 'closed';
    }
}
