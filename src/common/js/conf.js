// 常量表示请求成功状态码
const ERR_OK = 0;

// 提供请求公共参数
const commonParams = {
  g_tk: 5381,
  inCharset: "utf-8",
  outCharset: "utf-8",
  format: "json",
  notice: 0
};

// 语义化播放模式 
const playMode = {
  order: 0, // 顺序播放
  loop: 1, // 循环播放
  random: 2 // 随机播放
}

export {
  ERR_OK,
  commonParams,
  playMode
};