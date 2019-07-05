// vue.config.js
module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        "/musichall": {
          target: "https://c.y.qq.com",
          changeOrigin: true
        },
        "/splcloud": {
          target: "https://c.y.qq.com",
          changeOrigin: true,
          //绕过referer限制，手动设置请求头
          headers: {
            referer: "https://c.y.qq.com",
            host: "c.y.qq.com"

          }
        },
        "/v8": {
          target: "https://c.y.qq.com",
          changeOrigin: true
        },
        "/base": {
          target: "https://c.y.qq.com",
          changeOrigin: true
        },
        "/lyric": {
          target: "https://c.y.qq.com",
          changeOrigin: true,
          headers: {
            referer: "https://c.y.qq.com",
            host: "c.y.qq.com"

          }
        },
        "/soso": {
          target: "https://c.y.qq.com",
          changeOrigin: true,
          headers: {
            referer: "https://c.y.qq.com",
            host: "c.y.qq.com"
          }
        }
      }
    }
  }
}