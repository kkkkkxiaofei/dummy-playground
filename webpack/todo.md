- (done)继续测试es module的打包，包括node_module路径

- 解决CommonJS无法从AST中读取依赖的问题,包括node_module路径
  - 排除node内置模块(http, path, fs...)
  - node_modules里又引入了外部的node_modules,需要切换NODE_MODULE_PATH

- (done)解决umd打包，兼容全局注入,包括node_module路径

- 导入json文件

- 动态导入（jsonp）

- (done)缓存

- 支持css

- 支持scss

- jsx(babel插件)