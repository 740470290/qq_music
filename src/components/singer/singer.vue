<template>
  <div class='singer'>
    <listview :singerList="singerList" @select="selectSinger"></listview>
    <transition name="slider">
      <router-view></router-view>      
    </transition>
  </div>
</template>

<script>
import { getSingerList } from "../../api/singer.js";
import { ERR_OK } from "../../common/js/conf.js";
import listview from "./listview";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      // 存放歌手信息
      singerList: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singerList = this.sortSinerList(res.data.list);
        }
      });
    },
    // 处理歌手信息，变成想要的数据结构
    sortSinerList(list) {
      let map = {
        hot: {
          title: "热门",
          items: []
        }
      };
      list.forEach((obj, index) => {
        if (index < 10) {
          map.hot.items.push({
            Fmid: obj.Fsinger_mid,
            Fname: obj.Fsinger_name,
            headImg: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${
              obj.Fsinger_mid
            }.jpg?max_age=2592000`
          });
        }
        // 获取 A ~ Z 的歌手数据
        let key = obj.Findex; // 获取 Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push({
          Fmid: obj.Fsinger_mid,
          Fname: obj.Fsinger_name,
          headImg: `https://y.gtimg.cn/music/photo_new/T001R150x150M000${
            obj.Fsinger_mid
          }.jpg?max_age=2592000`
        });
      });
      // 处理成数组
      let ret = [];
      let hot = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === "热门") {
          hot.push(val);
        }
      }
      // ret数组排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      // 返回拼接后的数据 - 数组
      return hot.concat(ret);
    },
    // 子组件派发的自定义事件的回调
    selectSinger(item) {
      // 根据 Fmid 去跳转路由
      this.$router.push({
        path: `/singer/${item.Fmid}`
      });
      // 提交一个mutations
      this.setSinger(item);
    }
  },
  components: {
    listview
  }
};
</script>

<style scoped lang="stylus" >
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
    .slider-enter,.slider-leave-to{
      transform : translate3d(100%,0,0);
    };
    .slider-enter-to,.slider-leave-active{
      transition: all 0.3s;
    }

</style>
