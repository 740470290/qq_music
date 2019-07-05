// 引入mutation-types.js
import * as types from "./mutation-types";
const mutations = {
  [types.SET_SINGER](state, data) {
    state.singer = data;
  },
  setPlaying(state, bool) {
    state.playing = bool;
  },
  setPlayList(state, list) {
    state.playList = list;
  },
  setOrderList(state, list) {
    state.orderList = list;
  },
  setFullScreen(state, bool) {
    state.fullScreen = bool;
  },
  setCurrentIndex(state, index) {
    state.currentIndex = index;
  },
  setPlayMode(state, mode) {
    state.mode = mode;
  },
  setSongurl(state, url) {
    state.playList[state.currentIndex].url = url;
  }
};

export default mutations;