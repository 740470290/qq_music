import Vue from "vue";
import Router from "vue-router";
import Recommend from "../components/recommend/recommend";
import Singer from "../components/singer/singer";
import Rank from "../components/rank/rank";
import Search from "../components/search/search";
import SingerDetail from "../components/singer-detail/singer-detail";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      // 首屏显示推荐页
      redirect: "/recommend"
    },
    {
      path: "/recommend",
      component: Recommend
    },
    {
      path: "/singer",
      component: Singer,
      // 子路由
      children: [
        {
          path: ":id", // 根据不同的id显示不同内容(动态路由)
          component: SingerDetail
        }
      ]
    },
    {
      path: "/rank",
      component: Rank
    },
    {
      path: "/search",
      component: Search
    }
  ]
});
