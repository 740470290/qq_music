import {
  commonParams
} from "../common/js/conf";
import Axios from "axios";
// 定义获取热门关键词接口
const getHotkey = () => {
  const url = "/splcloud/fcgi-bin/gethotkey.fcg";
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
  });
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
};

// 定义获取搜索列表接口
const getSearchList = (query) => {
  const url = "/soso/fcgi-bin/search_for_qq_cp";
  const data = Object.assign({}, commonParams, {
    w: query,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: 1,
    remoteplace: 'txt.mqq.all'
  });
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
};

export {
  getHotkey,
  getSearchList
}