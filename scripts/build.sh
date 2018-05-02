#!/usr/bin/env bash

baseDir=..
packageDir=dist/package
appPath=$packageDir/ak-tool-darwin-x64/ak-tool.app

# 进入目录
cd $baseDir

# 运行编译
node .electron-vue/build.js

# 打包
ignore="
--ignore=.idea
--ignore=.electron-vue
"
electron-packager . ak-tool --overwrite --out=$packageDir $ignore

# 打开打包好的app
open $appPath