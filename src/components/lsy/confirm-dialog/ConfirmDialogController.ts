import ConfirmDialog from './ConfirmDialog.vue'
import { createVNode, render } from 'vue'

export function confirmMessage(
  message: string,
  appendToDom: HTMLElement = document.body
) {
  const vueContainerDom = document.createElement('div')
  appendToDom.append(vueContainerDom)
  function destroy() {
    render(null, vueContainerDom)
    vueContainerDom.parentNode?.removeChild(vueContainerDom)
  }
  return new Promise<void>((resolve, reject) => {
    function confirm() {
      destroy()
      resolve()
    }
    function cancel() {
      destroy()
      reject()
    }
    const vNode = createVNode(ConfirmDialog, { message, confirm, cancel })
    render(vNode, vueContainerDom)
  })
}
