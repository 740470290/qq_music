const getters = {
  singer(state) {
    return state.singer;
  },
  playing(state) {
    return state.playing;
  },
  playList(state) {
    return state.playList;
  },
  fullScreen(state) {
    return state.fullScreen;
  },
  orderList(state) {
    return state.orderList;
  },
  playMode(state) {
    return state.mode;
  },
  currentIndex(state) {
    return state.currentIndex;
  },
  currentSong(state) {
    return state.playList[state.currentIndex] || {};
  }
};

export default getters;
