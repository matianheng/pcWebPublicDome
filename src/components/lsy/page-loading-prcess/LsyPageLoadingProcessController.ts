import { createVNode, render } from 'vue'
import LsyPageLoadingProcess from './LsyPageLoadingProcess.vue'
import type { ComponentExposed } from 'vue-component-type-helpers'

type LsyPageLoadingProcessExposed = ComponentExposed<
  typeof LsyPageLoadingProcess
>
export type CloseLoadingProcessMethod = () => void
/**
 * 显示LsyPageLoadingProcess组件
 * @param delayCreateTime 延迟创建 LsyPageLoadingProcess 组件的时间. 单位: 毫秒. 默认:200
 * @returns 销毁LsyPageLoadingProcess组件的方法
 */
export function loadingProcess(
  delayCreateTime = 200
): CloseLoadingProcessMethod {
  const vueContainerDom = document.createElement('div')
  document.body.append(vueContainerDom)
  let exposed: LsyPageLoadingProcessExposed | undefined
  // 这里之所以延迟创建LsyPageLoadingProcess组件,是为了尽量避免LsyPageLoadingProcess组件一闪而过
  // 这里表达的意思就是: 如果 delayCreateTime 毫秒内, 组件加载出来了, 则LsyPageLoadingProcess不显示
  const flag = window.setTimeout(() => {
    const vNode = createVNode(LsyPageLoadingProcess, { percentage: 90 })
    render(vNode, vueContainerDom)
    exposed = vNode.component?.exposed as LsyPageLoadingProcessExposed
  }, delayCreateTime)
  function close() {
    clearTimeout(flag)
    console.log('exposed', exposed)
    if (exposed) {
      exposed.over().then(() => {
        render(null, vueContainerDom)
        vueContainerDom.parentNode?.removeChild(vueContainerDom)
      })
    } else {
      render(null, vueContainerDom)
      vueContainerDom.parentNode?.removeChild(vueContainerDom)
    }
  }
  return close
}
