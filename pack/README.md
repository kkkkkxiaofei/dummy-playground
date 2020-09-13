### 简介

[pack](http://flypursue.com/notes/Webpack/bundler.html) 是一个入门级别的前端打包工具, 此轮子仅用作学习交流和讨论，不能成熟的应用于实际项目。

### 全局安装

```
npm i -g @dummmy/pack
```

### 示例

examples里面一共有四个例子，代表了几种常见的打包需求，例如：

```
git clone git@github.com:kkkkkxiaofei/dummy-playground.git

cd pack/examples/vanilla-commonjs

npm i

npm run build

```

`main.js` in `vanilla-commonjs`:


```
const isArray = require('./util');

const arr = [1,2,3];

console.log(`[1,2,3] is array: ${isArray(arr)}`);
```

打包后输出：

```
(
  (function (modules) {
    function load(id) {
      const [factory, mapping] = modules[id];

      function require(relativePath) {
        return load(mapping[relativePath]);
      }
      const module = {
        exports: {}
      }
      const result = factory(require, module, module.exports);
      if (module.exports && Object.getOwnPropertyNames(module.exports).length === 0) {
        return result;
      }
      return module.exports;
    }
    return function () {
      return load(0);
    }
  })({
    0: [
      function (require, module, exports) {
        const isArray = require('./util');

        const arr = [1, 2, 3];
        console.log(`[1,2,3] is array: ${isArray(arr)}`);
      },
      {
        "./util": 1
      }
    ],

    1: [
      function (require, module, exports) {
        const isArray = arr => arr instanceof Array;

        module.exports = isArray;
      },
      {}
    ],
  })
)()

```

### 已(未)实现的功能

- 1.pack EMS/CJS(done)

- 2.pack node_modules(done)

- 3.code split(done)

- 4.umd(done)

- 5.configuration(done)

- 5.alias(todo)

- 6.json support(todo)

- 7.css/scss support(todo)