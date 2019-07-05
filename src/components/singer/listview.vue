<template>
  <Scroll class='listview' ref="listview">
    <ul>
      <li
        v-for="(group, index) in singerList"
        class="list-group"
        :key="index"
        ref = "listGroup"
      >
        <h2
          class="list-group-title"
          v-text="group.title"
        ></h2>
        <ul>
          <li
            v-for="(item, index) in group.items"
            class='list-group-item'
            :key="index"
            @click="selectItem(item)"
          >
            <img
              :src="item.headImg"
              class='avatar'
            >
            <span
              class="name"
              v-text="item.Fname"
            ></span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 绝对定位 -->
    <div class="list-shortcut">
      <ul>
        <li
          v-for="(item,index) in titleList"
          class="item"
          :key="index"
          @touchstart="touchIndex(index)"
        >{{ item }}</li>
      </ul>
    </div>
  </Scroll>
</template>
<script>
import Scroll from "../../base/scroll/scroll";
export default {
  props: {
    singerList: {
      type: Array,
      default: []
    }
  },
  computed: {
    titleList() {
      // 返回一个包含title的数组
      return this.singerList.map((obj, index) => {
        return obj.title.slice(0, 1);
      });
    }
  },
  methods: {
    touchIndex(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index]);
    },
    selectItem(item) {
      // console.log(item);
      // 向singer派发自定义事件,传递歌手信息
      this.$emit("select", item);
    }
  },
  components: {
    Scroll
  }
};
</script>
<style scoped lang="stylus">
@import '../../common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
