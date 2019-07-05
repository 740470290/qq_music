<template>
  <div class="recommend">
    <Scroll class='recommend-content' :data="hotSongs">
      <div>
        <!-- 轮播图 -->
        <div class='slider-wrapper'>
          <Slider></Slider>
        </div>
        <!-- 热门歌曲列表 -->
        <div class='recommend-list'>
          <h1 class='list-title'>热门歌曲推荐</h1>
          <ul>
            <li
              v-for='item in hotSongs'
              class='item'
            >
              <div class='icon'>
                <img
                  v-lazy="item.imgurl"
                  width='60'
                  height='60'
                >
              </div>
              <div class='text'>
                <h2
                  class='name'
                  v-html='item.creator.name'
                ></h2>
                <p
                  class='desc'
                  v-html='item.dissname'
                ></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading -->
      <div class='loading-container' v-show='!hotSongs.length'>
        <Loading></Loading>
      </div>
    </Scroll>
  </div>
</template>

<script>
import Slider from "./slider";
import { getHotList } from "../../api/reacommend.js";
import { ERR_OK } from "../../common/js/conf";
import Loading from "../../base/loading/loading";
import Scroll from "../../base/scroll/scroll";
export default {
  components: {
    Slider,
    Loading,
    Scroll
  },
  data() {
    return {
      hotSongs: []
    };
  },
  created() {
    // setTimeout(()=>{
    this._getHotList();
    // },3000)
  },
  methods: {
    _getHotList() {
      getHotList().then(res => {
        if (res.code === ERR_OK) {
          this.hotSongs = res.data.list;
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus" >
@import '../../common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
