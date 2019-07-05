<template>
  <Scroll
    ref="suggest"
    class='suggest'
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="item in result"
      >
        <div class="icon">
          <i :class="getIcon(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{ getName(item) }}</p>
        </div>
      </li>
    </ul>
    <div
      class="no-result-wrapper"
      display='none'
    >
      <!-- <no-result title="抱歉，暂无搜索结果"></no-result> -->
    </div>
  </Scroll>
</template>
<script>
import { getSearchList } from "../../api/search.js";
import { ERR_OK } from "../../common/js/conf.js";
import Scroll from "../../base/scroll/scroll";
export default {
  data() {
    return {
      result: []
    };
  },
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  watch: {
    query() {
      this._search();
    }
  },
  methods: {
    _search() {
      getSearchList(this.query).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.getResult(res.data);
        }
      });
    },
    getResult(list) {
      let ret = [];
      // 判断有没有 zhida 字段，zhida.singerid 字段
      if (list.zhida && list.zhida.singerid) {
        ret.push({ ...list.zhida, ...{ type: "singer" } });
      }
      if (list.song) {
        ret = ret.concat(list.song.list);
      }
      return ret;
    },
    getIcon(item) {
      if (item.type === "singer") {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getName(item) {
      if (item.type === "singer") {
        return item.singername;
      } else {
        return `${item.songname} ~ ${this.filterSinger(item.singer)}`;
      }
    },
    filterSinger(singer) {
      if (!singer) {
        return "";
      }
      let ret = [];
      singer.forEach(s => {
        ret.push(s.name);
      });
      return ret.join(" / ");
    }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>