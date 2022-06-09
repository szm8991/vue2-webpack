import { compile } from './compile'
function createApp(component) {
  const renderer = createRenderer({
    querySelector(selector) {
      return document.querySelector(selector)
    },
    insert(child, parent, anchor) {
      parent.insertBefore(child, anchor || null)
    },
    createElement(tag) {
      return document.createElement(tag)
    },
    createFragment(template) {
      return document.createRange().createContextualFragment(template)
    },
  })
  return renderer.createApp(component)
}
function createRenderer({ querySelector, insert, createElement, createFragment }) {
  return {
    createApp(options) {
      // app instance
      return {
        mount(selector) {
          this.$options = options
          //兼容options api，处理数据来源
          this.data = options.data()
          const parent = querySelector(selector)
          //获取渲染函数
          if (!options.render) {
            options.render = this.compile(options.template || '')
          }
          //结合数据选项解析模板，生成节点字符串
          this.$data = new Proxy(this, {
            get(target, key, receiver) {
              console.log('get')
              return target.data[key]
            },
            set(target, key, newValue, receiver) {
              console.log('set')
              target.data[key] = newValue
              return newValue
            },
          })
          const el = options.render.call(this.$data)
          //渲染
          parent.innerHTML = ''
          insert(compile(el, this), parent)
        },
        compile(template) {
          return function render() {
            const fragment = createFragment(template)
            return fragment
          }
        },
      }
    },
  }
}
export { createApp }
