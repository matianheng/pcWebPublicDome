module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    /*
      postcss-preset-env作用: 打包时自动给css加特定浏览器前缀的代码。浏览器版本配置在package.json的browserslist中
       */
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
    /*
      cssnano作用:将css进行打包优化，能够减小打包后的css体积
      (如何看是否有效: 去掉这个配置，打包一次截图css的体积，加上这个配置再打包一次，
        对比两次打包后css的体积变化，会发现加了这个配置体积会小一点). 
        官网: https://www.cssnano.cn/docs/what-are-optimisations/

        cssDeclarationSorter设置为false是禁止cssnano再对属性结果重新排序. 因为stylelint已经排好序了
       */
    cssnano: {
      preset: ['default', { cssDeclarationSorter: false }],
    },
    // 'postcss-px-to-viewport-8-plugin': {
    //   unitToConvert: 'px', // 要转化的单位
    //   viewportWidth: 1920, // UI设计稿的宽度
    //   unitPrecision: 6, // 转换后的精度，即小数点位数
    //   propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    //   viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
    //   fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
    //   selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
    //   minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
    //   mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
    //   replace: true, // 是否转换后直接更换属性值
    //   exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
    //   landscape: false, // 是否处理横屏情况
    // },
  },
}
