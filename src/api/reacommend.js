import Axios from "axios";
import { commonParams } from "../common/js/conf";
// 定义一个 getSliderList

const getSliderList = () => {
  const url = "/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  // 合并公共参数
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: "h5",
    needNewCode: 1
  });
  // 返回一个 Promise 对象
  return Axios.get(url, {
    params: data
  })
    .then(res => {
      return Promise.resolve(res.data);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

// 定义获取热门歌曲列表 getHotList
const getHotList = () => {
  const url = "/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg";
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    hostUin: 0,
    platform: "yqq.json",
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  });
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};

export { getSliderList, getHotList };
