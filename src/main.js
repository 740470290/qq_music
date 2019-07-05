// 开头第一行引入polyfill
import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import fastclick from "fastclick";
import VueLazyload from "vue-lazyload";
import "./common/stylus/index.styl";
// 整个body点击没有延时
fastclick.attach(document.body);

import Vant from "vant";
import "vant/lib/index.css";
// 引入 index.styl

Vue.use(Vant);
Vue.use(VueLazyload, {
  loading: require("./common/images/default.png")
});


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
