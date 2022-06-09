const regTextExp = /\{\{(.+)\}\}/
const regFnArgs = /(.+?)\((.+?)\)/
const expPool = new Map()
const eventPool = new Map()
function hasData(data, expression) {
  for (const key in data) {
    if (expression.includes(key)) {
      if (expression !== key)
        return {
          key,
          expression,
        }
      else if (expression === key) {
        return {
          key,
        }
      }
    }
  }
  return null
}
export function compile(el, vm) {
  const allNodes = el.querySelectorAll('*')
  Array.from(allNodes).forEach(node => {
    const vText = node.textContent
    const expMatch = vText.match(regTextExp)
    if (expMatch) {
      const expInfo = hasData(vm.data, expMatch[1].trim())
      expInfo && expPool.set(node, expInfo)
    }
    const vClick = node.getAttribute('@click')
    if (vClick) {
      const eveInfo = vClick.match(regFnArgs)
      const fn = eveInfo[1]
      const args = eveInfo[2]
      const handler = vm.$options.methods[fn].bind(vm, ...args)
      handler &&
        eventPool.set(node, {
          type: 'click',
          handler,
        })
      node.removeAttribute('@click')
    }
  })
  for (const [node, exp] of expPool) {
    const { expression } = exp
    const r = new Function(
      'vm',
      'node',
      `
          with(vm.data){
              node.textContent=${expression}
          }
        `
    )
    r(vm, node)
  }
  for (const [node, handler] of eventPool) {
    node.addEventListener(handler.type, handler.handler)
  }
  return el
}
