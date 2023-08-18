const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin(),
      require('unplugin-element-plus/webpack')({
        // options
      }),
    ],
  },
  publicPath: "./",
  // devServer: {
  //   historyApiFallback: true,
  //   proxy: {
  //     '/api': {
  //       target: 'http://api.niutrans.com',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': ''
  //       }
  //     }
  //   }
  // },

})
