#!/usr/bin/env bash
cd ..
node .electron-vue/build.js
electron-packager . ak-tool --overwrite --out=dist/package
#electron-builder .
open dist/package/electron-vue-darwin-x64/electron-vue.app
