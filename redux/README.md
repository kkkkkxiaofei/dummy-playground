构建说明：

当前`webpack`不适合编译类库，尤其无法将输出转换为`es6`，在不切换至`rollup`的情况下，当前各版本输出方式如下：

`es`: 利用`preset-typescript`转译为es6，含types文件。

`lib`: 利用`preset-typescript`和`preset-env`转译为es5，含types文件。

以上两种期待的输出应该为`es/lib`的`bundle`形式，当前`webpack`无法实现，无奈只能用`babel`。`types`文件原本只需在`package.json`声明一次即可，这里由于没有使用打包工具，`index`里又引用了`types`，只得强行输出（尽管文件为空）。

`umd`: 利用webpack实现（它就是干这事的）。

> ps: 后期还是迁移到`rollup`或者用`tsc`。