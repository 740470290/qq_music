import { commonParams } from "../common/js/conf";
import Axios from "axios";
// 定义获取歌手信息的接口
const getSingerList = () => {
  const url = "/v8/fcg-bin/v8.fcg";
  const data = Object.assign({}, commonParams, {
    channel: "singer",
    page: "list",
    key: "all_all_all",
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    paltform: "yqq"
  });
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};

const getSingerDetail = singermid => {
  const url = "/v8/fcg-bin/fcg_v8_singer_track_cp.fcg";
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: "yqq.json",
    needNewCode: 0,
    ct: 24,
    singermid: singermid,
    order: "listen",
    begin: 0,
    num: 30,
    songstatus: 1
  });
  return Axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};

export { getSingerList, getSingerDetail };
