import { commonParams } from "../common/js/conf";
import Axios from "axios";
// 定义获取vkey的接口

const getVkey = (songmid)=> {
  const url = "/base/fcgi-bin/fcg_music_express_mobile3.fcg";
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: "yqq",
    needNewCode: 0,
    songmid: songmid,
    uin: 0,
    cid: 205361747,
    guid: 7887736840,
    filename: `C400${songmid}.m4a`
  });
  return Axios.get(url, {
    params: data
  }).then(res=> {
    return Promise.resolve(res.data);
  })
};

export default getVkey;