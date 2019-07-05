<template>
  <div class='singer-detail'>
    <music-list :title="getTitle" :bgImage="getBg" :songs="songs"></music-list>  
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "../../api/singer.js";
import { ERR_OK } from "../../common/js/conf.js";
import createSongs from "../../common/js/songs.js";
import MusicList from "../../base/musiclist/music-list";
export default {
  data() {
    return {
      // 维护一个歌曲列表
      songs: []
    };
  },
  computed: {
    ...mapGetters(["singer"]),
    getTitle() {
      return this.singer.Fname;
    },
    getBg() {
      return this.singer.headImg;
    }
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if(!this.singer.Fmid){
        this.$router.back();
        return;
      }
      // 获取歌手详情 - 歌手歌曲信息
      getSingerDetail(this.singer.Fmid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.sortSongs(res.data.list);
        }
      });
    },
    // 处理歌曲信息，提取关键信息
    sortSongs(songs) {
      let ret = [];
      songs.forEach(item => {
        let { musicData } = item;
        // console.log(musicData);
        ret.push(createSongs(musicData));
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>
