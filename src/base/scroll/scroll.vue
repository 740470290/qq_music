<template>
  <div ref='wrapper'>
    <slot></slot>
  </div>
</template>

<script>
// 引入滚动插件
import BScroll from "better-scroll";
export default {
  props: {
    probeType: {
      type: Number, // 监听滚动事件
      default: 1
    },
    click: {
      // 是否开启click事件
      type: Boolean,
      default: true
    },
    data: {
      // 监听组件数据的变化
      type: Array,
      default: null
    }
  },
  methods: {
    // 组件内部私有方法，不允许在外部调用
    _initScroll() {
      // 判断scroll组件是否被加载
      if (!this.$refs.wrapper) {
        return;
      }
      // 实例化一个Scroll对象，第一参数：DOM元素
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollY: true
      });
    },
    enable() {
      // 启动BScroll
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 禁用BScroll
      this.scroll && this.scroll.disable();
    },
    refresh() {
      -// 刷新方法
      this.scroll && this.scroll.refresh();
    },
    scrollToElement(elem,ms) {
      // elem: 需要滚动到的元素
      this.scroll && this.scroll.scrollToElement(elem,ms);
    },
    scrollTo(x, y, ms){
      this.scroll && this.scroll.scrollTo(x,y,ms);
    }
  },
  // DOM加载完毕才能执行 BScroll
  mounted() {
    setTimeout(() => {
      // 延迟加载，确保DOM加载完
      this._initScroll();
    }, 20);
  },
  watch: {
    data() {
      // 监听 data 的变化，重新计算高度
      this.refresh();
    }
  }
};
</script>
