import { playMode } from "../common/js/conf";
const state = {
  singer: {},
  playing: true,
  fullScreen: false,
  playList: [],
  orderList: [],
  mode: playMode.order,
  currentIndex: -1
};

export default state;
