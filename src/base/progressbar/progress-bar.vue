<template>
  <div
    class="progress-bar"
    ref="progressBar"
  >
    <div class="bar-inner" @click="clickProgress">
      <div
        class="progress"
        ref="progress"
      ></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="touchStart"
        @touchmove.prevent="touchMove"
        @touchend.prevent="touchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created(){
    // 定义事件公共参数
    this.touches = {};
  },
  methods: {
    touchStart(e) {
      // 定义一个标志位 isStart ，为true表示开始touch
      this.touches.isStart = true;
      this.touches.startX = e.touches[0].pageX;
      // 获取 已播放的进度值 
      this.touches.left = this.$refs.progress.clientWidth; 
    },
    touchMove(e) {
      if(!this.touches.isStart){ // 判断有没有开始滑动
        return;
      }
      // 计算得到 滑动的距离 distanceX 
      const distanceX = e.touches[0].pageX - this.touches.startX;
      // 计算偏移值 已播放进度值(left) + distanceX  
      // 取两值之间的范围 Math.max()  Math.min() 
      let offset = Math.min(this.$refs.progressBar.clientWidth - 16, Math.max(0,this.touches.left + distanceX));
      this._offset(offset);
    },
    touchEnd(e) {
      // 表示 touch 结束
      this.touches.isStart = false;
      this.triggerPercent();
    },
    triggerPercent(){
      const  barWidth = this.$refs.progressBar.clientWidth - 16;
      const percent = this.$refs.progress.clientWidth / barWidth; 
      // 获取到新的 percent 在派发出去
      this.$emit("percentChange", percent);
    },
    _offset(offset){
      // progressBtn 添加 transform 
      this.$refs.progressBtn.style.transform = `translateX(${offset}px)`;
      this.$refs.progress.style.width = offset+"px";
    },
    clickProgress(e){
      // 调用 _offset 设置偏移值 
      this._offset(e.offsetX);
      // 派发 percent, 重置 currentTime 
      this.triggerPercent();
    }
  },
  watch: {
    // 当歌曲播放时，percent就会发生改变
    percent(newPer, oldPer) {
      // 拖动时touch的权值最大，停止监听
      if(this.touches.isStart){
        return;
      }
      // 获取播放条的宽度
      const barWidth = this.$refs.progressBar.clientWidth - 16;
      let offset = newPer * barWidth;
      this._offset(offset);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>