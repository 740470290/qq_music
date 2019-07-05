<template>
  <div
    class='player'
    v-show="playList.length > 0"
  >
    <transition name="normal">
      <div
        class='normal-player'
        v-show="fullScreen"
      >
        <div class='background'>
          <img
            width='100%'
            height='100%'
            :src="currentSong.albumImg"
          >
        </div>
        <!-- 返回按钮和歌曲信息 -->
        <div class='top'>
          <div
            class='back'
            @click="toggleMini"
          >
            <i class='icon-back'></i>
          </div>
          <h1 class='title'>{{ currentSong.songname }}</h1>
          <h2 class='subtitle'>{{ currentSong.singer }}</h2>
        </div>
        <!-- 中间播放的CD -->
        <div class='middle'>
          <div class='middle-l'>
            <div class='cd-wrapper'>
              <div class='cd' :class="rotateCD">
                <img
                  class='image'
                  :src="currentSong.albumImg"    
                >
              </div>
            </div>
            <div class='playing-lyric-wrapper'>
              <div class='playing-lyric'>
                {{ playLyric }}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <Scroll class="middle-r" ref="lyricList">
            <div class='lyric-wrapper'>
              <div v-if="currentLyric">
                <!-- 当前播放行 -->
                <p
                  class="text"
                  v-for="(line,index) in currentLyric.lines"
                  :class="{'current':currentLine === index}"
                  :key="index"
                  ref="lyricLine"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 底部的按钮 -->
        <div class='bottom'>
          <!-- 播放进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ fromatTime(currentTime) }}</span>
            <!-- 播放进度条显示 -->
            <div class='progress-bar-wrapper'>
              <progress-bar
                :percent="percent"
                @percentChange="timeChange"
              ></progress-bar>
            </div>
            <span class='time time-r'>{{ fromatTime(currentSong.interval) }}</span>
          </div>
          <div class='operators'>
            <div
              class='icon i-left'
              @click="changeMode"
            >
              <i :class='iconMode'></i>
            </div>
            <!-- 上一首 -->
            <div class='icon i-left'>
              <i
                class='icon-prev'
                @click="prev"
              ></i>
            </div>
            <div class='icon i-center'>
              <i
                :class='playIcon'
                @click="togglePlay"
              ></i>
            </div>
            <!-- 下一首 -->
            <div class='icon i-right'>
              <i
                class='icon-next'
                @click="next"
              ></i>
            </div>
            <div class='icon i-right'>
              <i class='icon-not-favorite'></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div
        class='mini-player'
        v-show="!fullScreen"
        @click="toggleFull"
      >
        <div class='icon'>
          <img
            width='40'
            height='40'
            :src="currentSong.albumImg"
            :class="rotateCD"
          >
        </div>
        <div class='text'>
          <h2 class='name'>{{ currentSong.songname }}</h2>
          <p class='desc'>{{ currentSong.singer }}</p>
        </div>
        <div class='control'>
          <i
            :class="miniIcon"
            @click.stop="togglePlay"
          ></i>
        </div>
        <div class='control'>
          <i class='icon-playlist'></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="canPlay"
      @timeupdate="timeUpdate"
      @ended="Ended"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import getVkey from "../../api/play";
import { ERR_OK } from "../../common/js/conf";
import progressBar from "../../base/progressbar/progress-bar";
import { playMode } from "../../common/js/conf.js";
import LyricParser from "lyric-parser";
import Scroll from "../../base/scroll/scroll";
export default {
  data(){
    return {
      songReady: false,
      currentTime: 0,
      currentLyric : null,
      currentLine: null,
      playLyric: ""
    }
  },
  computed: {
    ...mapGetters([
      "playList",
      "fullScreen",
      "currentSong",
      "playing",
      "currentIndex",
      "playMode",
      "orderList"
    ]),
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon(){
      return this.playing ? "icon-pause-mini": "icon-play-mini";
    },
    rotateCD(){
      return this.playing ? "play" : "play pause"
    },
    // 播放百分比
    percent(){
      //  播放进度 = 当前播放时间 / 播放总时长
      return this.currentTime / this.currentSong.interval;
    },
    // 获取mode的样式
    iconMode(){
      return this.playMode === playMode.order? "icon-sequence" : this.playMode===playMode.loop ? "icon-loop" : "icon-random";
    }
  },
  methods: {
    ...mapMutations([
      "setFullScreen", 
      "setSongurl",
      "setPlaying",
      "setCurrentIndex",
      "setPlayMode",
      "setPlayList"
    ]), 
    // 切换到 mini 页
    toggleMini() {
      this.setFullScreen(false);
    },
    toggleFull() {
      this.setFullScreen(true);
    },
    // 定义获取getVkey方法
    _getVkey() {
      return getVkey(this.currentSong.songmid).then(res => {
        if (res.code === ERR_OK) {
          const url = `http://dl.stream.qqmusic.qq.com/C400${
            this.currentSong.songmid
          }.m4a?guid=7887736840&vkey=${
            res.data.items[0].vkey
          }&uin=0&fromtag=66`;
          return Promise.resolve(url);
        }
      });
    },
    // 切换播放暂定
    togglePlay() {
      // 判断lyric有，实现歌词的播放暂停切换
      if(this.currentLyric){
        this.currentLyric.togglePlay();
      }
      // 切换 playing 
      this.setPlaying(!this.playing);
    },
    // 切换上一首
    prev(){
      // 判断歌曲有没有准备好
      if(!this.songReady){
        return;
      }
      let index = this.currentIndex -1;
      if(index === -1){
        index = this.playList.length - 1;
      };
      // 暂停时切歌，playing 状态修改成正确的值
      if(!this.playing){
        this.togglePlay();
      }
      // 提交 setCurrentIndex 
      this.setCurrentIndex(index);
      // 修改 songReady 为 false
      this.songReady = false;
    },
    // 切换下一首
    next(){
      // 判断歌曲有没有准备好
      if(!this.songReady){
        return;
      }
      let index = this.currentIndex +1;
      if(index === this.playList.length){
        index = 0;
      };
      if(!this.playing){
        this.togglePlay();
      }
      // 提交 setCurrentIndex 
      this.setCurrentIndex(index);
      this.songReady = false;
    },
    canPlay(){
      this.songReady = true;
    },
    // 处理时间格式为  m : s 
    fromatTime(time){
      time = Math.floor(time);
      let m = Math.floor(time / 60);
      let s = time % 60;
      if(String(m).length < 2){
        m = "0"+ m;
      };
      if(String(s).length < 2){
        s = "0" + s;
      };
      return `${m}:${s}`; 
    },
    // 获取当前播放时间 currentTime 
    timeUpdate(e){
      this.currentTime = e.target.currentTime;
    },
    // 改变当前播放时间 currentTime
    timeChange(percent){
      // 设置当前播放时间 = 新的percent * 总时长
      const currentTime = 
          percent * this.currentSong.interval;
      this.$refs.audio.currentTime = currentTime;
      // 拖动进度条，改变歌词进度
      if(this.currentLyric){
        // 跳转到对应的播放进度 ms
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    // 切换模式 
    changeMode(){
      let mode = (this.playMode + 1) % 3;
      //  mode state 
      this.setPlayMode(mode);
      let list = null; // 初始化一个 list 数组 
      // 判断当前模式是随机模式
      if(this.playMode === playMode.random){
        list = this.randomList(this.orderList);   
      }else{
        // 当播放模式切回顺序时，播放列表要还原回来
        list = this.orderList;
      };
      // 定义 currentIndex 重置方法
      this.resetCurrentIndex(list);
      // 提交 setPlayList 来改变播放列表
      this.setPlayList(list);
    },
    // 定义一个乱序方法
    randomList(list){
      // 不能直接修改list ,把数据拷贝一份
      // let _list = list.slice();
      let _list  = [...list]; 
      for(let i=0;i<_list.length;i++) {
        // 在 0 ~ i 之间生成一个随机整数 
        let j = Math.floor(Math.random() * (i+1));
        let index = _list[i];
        _list[i] = _list[j];
        _list[j] = index;  
      }
      return _list;
    },
    resetCurrentIndex(list){
      let index = list.findIndex((item)=>{
        return item.songid === this.currentSong.songid;
      });
      // 提交 setCurrentIndex
      this.setCurrentIndex(index);
    },
    // 歌曲结束自动播放下一首
    Ended(){
      if(this.playMode === playMode.loop){
        this.loop();
      }else{
        // 不是就切换下一首
        this.next();
      }
    },
    // 单曲循环
    loop(){
      // 把当前播放时间设为0
      this.$refs.audio.currentTime = 0;
      // 调用 play 方法 
      this.$refs.audio.play();
    },
    // 获取解析后的歌词
    getLyricParser(){
      this.currentSong._getLyric().then(lyric=>{
        // 实例化一个 lyricParser 对象
        // lineNun: 当前播放行数 下标
        // txt : 当前播放行的内容
        this.currentLyric = 
          new LyricParser(lyric,({lineNum,txt})=>{
            this.currentLine = lineNum;
            // playLyric 当前播放歌词 = txt;
            this.playLyric = txt;
            if(lineNum > 5){
              let elem = this.$refs.lyricLine[lineNum-5];
              this.$refs.lyricList.scrollToElement(elem,1000);
            }else{
              // 回到歌词开头 
              this.$refs.lyricList.scrollTo(0,0,100);
            }
          });
        if(this.playing){
          // 播放歌词
          this.currentLyric.play();
        }
      }).catch(err=>{
        this.currentLyric = null;
        this.playLyric = '';
        this.currentLine = 0;
      });
    }
  },
  watch: {
    currentSong(newSong,oldSong) {
      // 判断新的song和旧的song的id是否相同，相同表示同一首歌
      if(newSong.songid === oldSong.songid){
        return;
      };
      this._getVkey().then(res => {
        // 提交 setSongurl , 给currentSong添加url
        this.setSongurl(res);
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.audio.play();
            if(this.currentLyric){
              this.currentLyric.stop();
            }
            this.getLyricParser();
          }, 500);
        });
      });
    },
    // 监听playing的状态改变，去控制audio的播放暂定
    playing(bool){
      const audio = this.$refs.audio;
      this.$nextTick(()=>{
        bool ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    progressBar,
    Scroll
  }
};
</script>

<style scoped lang="stylus" >
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          margin: 0 5px;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>