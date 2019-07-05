import getLyric from "../../api/lyric";
import {
  Base64
} from "js-base64";
import {
  ERR_OK
} from "./conf";
// 歌曲信息我们需要单独创建，可以复用
class Songs {
  constructor({
    songid, // 歌曲id
    songmid, // mid
    songname, // 歌曲名
    singer, // 歌手信息
    albummid, // 专辑头像部分
    albumname, // 专辑名称
    interval, // 歌曲时长
    albumImg
  }) {
    this.songid = songid;
    this.songmid = songmid;
    this.songname = songname;
    this.singer = singer;
    this.ablummid = albummid;
    this.albumname = albumname;
    this.interval = interval;
    this.albumImg = albumImg;
    this.url = "";
    this.lyric = "";
  }
  // song类扩展一个公共方法 
  _getLyric() {
    if (this.lyric.length) { // 如果有lyric
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.songmid).then(res => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject("lyric is not defined");
        }
      })
    })
  }
}

// 封装Songs类，扩展一个工厂函数
const createSongs = musicData => {
  return new Songs({
    songid: musicData.songid,
    songmid: musicData.songmid,
    songname: musicData.songname,
    singer: filterSinger(musicData.singer),
    albummid: musicData.albummid,
    albumname: musicData.albumname,
    interval: musicData.interval,
    albumImg: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`
  });
};


// 处理歌手信息
function filterSinger(singer) {
  if (!singer) {
    return "";
  }
  let ret = [];
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join(" / ");
}

export default createSongs;