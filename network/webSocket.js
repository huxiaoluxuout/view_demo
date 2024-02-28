import {WebSocketManager} from "@/network/WebSocketManager";
import {AudioPlayer} from "@/network/AudioPlayer";


import {BASE_URL} from "@/network/config";



const wsUrl = 'wss://feiying.ahjinti.cn/wss';
const AudioUrl = BASE_URL + '/555551.mp3'


export const wsManager = new WebSocketManager(wsUrl);


const audioPlayer = new AudioPlayer(AudioUrl);


export const connectWs = () => {


    // 设置消息回调函数
    wsManager.setOnMessageCallback((data) => {
        // 处理接收到的数据

        // console.log('执行回调处理消息:', data);
        if (data.type === 'customer_notice') {
            uni.$emit('deskHandler')
            uni.showToast({title: data.data.msg, icon: 'none'})
            // 有新订单,播放语音
            if (data.data.type == 0) {
                audioPlayer.play()
            }
            let sendMessage = {
                "api": "CustomerNotice/noticeRead",
                "token": uni.getStorageSync('token'),
                "data": {
                    "id": data.data.id
                }
            }
            wsManager.sendMessage(JSON.stringify(sendMessage))
        }
    });
    // 初始化连接
    wsManager.init();

    return new Promise(resolve => {
        resolve({type: wsManager.getConnectionState(), wsManager})
    })

}


