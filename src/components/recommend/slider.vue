<template>
  <div class="slider">
    <van-swipe
      class='slider-group'
      :autoplay="3000"
      ref='vanItem' 
    >
      <van-swipe-item
        class='slider-item'
        v-for='(item, index) in sliderList'
        :key='index'
      >
        <img :src="item.picUrl">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { getSliderList } from "../../api/reacommend.js";
import { ERR_OK } from "../../common/js/conf.js";

export default {
  data() {
    return {
      sliderList: []
    };
  },
  created() {
    // 这里不要写大段的逻辑
    this._getSliderList();
  },
  methods: {
    // 请求轮播数据 - Ajax=> axios
    _getSliderList() {
      // 调用轮播数据接口，得到Promsie对象
      getSliderList()
        .then(res => {
          if (res.code === ERR_OK) {
            // 把数据交个组件的data去维护
            this.sliderList = res.data.slider;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    setTimeout(() => {
      let vanItem = this.$refs.vanItem.$el;
      console.log(vanItem);
    }, 20);
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>
