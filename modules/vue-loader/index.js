const regTemplate = /\<template\>([\s\S]+?)<\/template\>/
const regScript = /\<script\>([\s\S]+?)<\/script\>/
const regReplace = /({)/
module.exports = function (source) {
  const template = source.match(regTemplate)[1].trim()
  const script = source.match(regScript)[1].trim()
  const finalScript = script.replace(regReplace, '$1 template:' + '`' + template + '`' + ',')
  return finalScript
}
