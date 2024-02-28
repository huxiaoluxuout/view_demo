
export class AudioPlayer {
    constructor(url) {
        this.audioUrl = url;
        this.innerAudioContext = uni.createInnerAudioContext();
    }

    // 播放音频
    play() {
        this.innerAudioContext.src = this.audioUrl;
        this.innerAudioContext.play();
        this.innerAudioContext.onPlay(() => console.log('开始播放'));
        this.innerAudioContext.onError((res) => console.error('播放音频出错:', res.errMsg));
    }
}
