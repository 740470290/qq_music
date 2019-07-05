<template>
  <div id="app">
    <m-header></m-header>
    <Tab></Tab>
    <!-- 渲染出口 -->
    <keep-alive>
      <router-view></router-view> 
    </keep-alive>
    <!-- player -->
    <Player></Player>
  </div>
</template>
<script>
import MHeader from "./components/m-header";
import Tab from "./components/tab/tabs";
import Player from "./components/player/player";
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>
