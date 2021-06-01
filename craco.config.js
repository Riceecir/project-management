const CracoLessPlugin = require("craco-less");

/* 使用 craco 自定义配置 */
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#0052CC",
              "@font-size-base": "14px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
