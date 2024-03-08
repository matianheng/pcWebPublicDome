import { ref } from 'vue'

export type RenderCallbackFun = () => void

export function renderByRequestAnimationFrame(
  renderCallbackFunArr: RenderCallbackFun[],
  idx = 0
) {
  if (idx < renderCallbackFunArr.length) {
    requestAnimationFrame(() => {
      const callback = renderCallbackFunArr[idx]
      if (callback) {
        callback()
      }
      renderByRequestAnimationFrame(renderCallbackFunArr, ++idx)
    })
  }
}

/**
 * 该hook用于优化复杂界面的界面渲染, 让复杂界面分区块渲染
 *
 * P.S. 用法示例详见
 *
 * @see src\pages\demo\form\complex-form\DynFormExample.vue
 * @see src\pages\demo\table\JsonTableExample.vue
 *
 * @param stepCount 需要顺序渲染的区块数量
 * @param lastCall 当所有区块渲染完毕，需要执行的回调函数
 * @returns
 */
export function useStepRenderHooks(stepCount: number, lastCall?: () => void) {
  const stepRenderFlagArr = ref<boolean[]>(Array(stepCount).fill(false))
  /**
   * 渲染区块
   * @param step 从哪个区块开始渲染
   */
  function stepRender(step = 0) {
    if (step < stepRenderFlagArr.value.length) {
      requestAnimationFrame(() => {
        stepRenderFlagArr.value[step] = true
        stepRender(++step)
      })
    } else {
      lastCall && lastCall()
    }
  }
  return { stepRender, stepRenderFlagArr }
}
