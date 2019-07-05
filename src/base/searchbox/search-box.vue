<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input
      ref="query"
      class="box"
      v-model='query'
      :placeholder="placeholder"
    />
    <i
      class="icon-dismiss"
      v-show="query"
      @click='clear'
    ></i>
  </div>
</template>

<script >

export default {
  data() {
    return {
      query: ""
    };
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入歌手或歌曲~'
    }
  },
  methods: {
    clear() {
      this.query = "";
    },
    // 交给父组件去用的
    addQuery(query){
      this.query = query;
    }
  },
  watch: {
    query() {
      // query发生变化，把query派发出去
      this.$emit('queryChange',this.query);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: #ddd;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-background;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: #ddd;
    color: #333;
    font-size: $font-size-medium;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>