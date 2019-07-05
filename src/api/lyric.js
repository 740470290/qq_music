import { commonParams } from "../common/js/conf";
import Axios from "axios";
// 定义获取歌词的接口
const getLyric = (songmid)=>{
  const url = "/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
  const data = Object.assign({},commonParams, {
    pcachetime: new Date(),
    songmid: songmid,
    hostUin: 0,
    platform: "yqq.json",
    needNewCode: 0
  });
  return Axios.get(url,{
    params: data
  }).then(res=>{
    return Promise.resolve(res.data);
  })
};
export default getLyric;