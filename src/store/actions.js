const actions = {
  selectPlay({
    commit
  }, {
    list,
    index
  }) {
    commit("setPlayList", list);
    commit("setCurrentIndex", index);
    commit("setOrderList", list);
    commit("setFullScreen", true);
  }
};

export default actions;