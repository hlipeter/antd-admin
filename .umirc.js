// https://umijs.org/config/
import { resolve } from 'path'
import { i18n } from './src/utils/config'
const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

export default {
  publicPath: 'https://cdn.antd-admin.zuiidea.com/',
  hash: true,
  ignoreMomentLocale: true,
  targets: { ie: 9 },
  dva: { immer: true },
  antd: {},
  dynamicImport: {
    loading: 'components/Loader/Loader'
  },
  // TODO: routes need to be array
  // routes: {
  //   update: routes => {
  //     if (!i18n) return routes

  //     const newRoutes = []
  //     for (const item of routes[0].routes) {
  //       newRoutes.push(item)
  //       if (item.path) {
  //         newRoutes.push(
  //           Object.assign({}, item, {
  //             path:
  //               `/:lang(${i18n.languages
  //                 .map(item => item.key)
  //                 .join('|')})` + item.path,
  //           })
  //         )
  //       }
  //     }
  //     routes[0].routes = newRoutes

  //     return routes
  //   },
  // },
  // not support in umi@3
  // pwa: {
  //   manifestOptions: {
  //     srcPath: 'manifest.json',
  //   },
  // },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme
  theme: lessToJs(fs.readFileSync(path.join(__dirname, './src/themes/default.less'), 'utf8')),
  // Webpack Configuration
  proxy: {
    '/api/v1/weather': {
      target: 'https://api.seniverse.com/',
      changeOrigin: true,
      pathRewrite: { '^/api/v1/weather': '/v3/weather' },
    },
  },
  alias: {
    api: resolve(__dirname, './src/services/'),
    components: resolve(__dirname, './src/components'),
    config: resolve(__dirname, './src/utils/config'),
    models: resolve(__dirname, './src/models'),
    routes: resolve(__dirname, './src/routes'),
    services: resolve(__dirname, './src/services'),
    themes: resolve(__dirname, './src/themes'),
    utils: resolve(__dirname, './src/utils'),
  },
  extraBabelPresets: ['@lingui/babel-preset-react'],
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
  ],
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            react: {
              name: 'react',
              priority: 20,
              test: /[\\/]node_modules[\\/](react|react-dom|react-dom-router)[\\/]/,
            },
            antd: {
              name: 'antd',
              priority: 20,
              test: /[\\/]node_modules[\\/](antd|@ant-design\/icons|@ant-design\/compatible|ant-design-pro)[\\/]/,
            },
            echarts: {
              name: 'echarts',
              priority: 20,
              test: /[\\/]node_modules[\\/]echarts|echarts-for-react|echarts-gl|echarts-liquidfill[\\/]/,
            },
            highcharts: {
              name: 'highcharts',
              priority: 20,
              test: /[\\/]node_modules[\\/](highcharts-exporting|highcharts-more|react-highcharts)[\\/]/,
            },
            recharts: {
              name: 'recharts',
              priority: 20,
              test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            },
            draftjs: {
              name: 'draftjs',
              priority: 20,
              test: /[\\/]node_modules[\\/](draftjs-to-html|draftjs-to-markdown)[\\/]/,
            },
            async: {
              chunks: 'async',
              minChunks: 2,
              name: 'async',
              maxInitialRequests: 1,
              minSize: 0,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      },
    })
  },
}
