import { Ref } from 'vue'
import { ElScrollbar } from 'element-plus'
import { onActivated } from 'vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

export type ElScrollbarType = InstanceType<typeof ElScrollbar>
export function useRecoverElScrollbarPosition(
  elScrollbarInstance: Ref<ElScrollbarType>
) {
  const $route = useRoute()
  const _systemBasePageScrollTopRef = ref<number>()
  const _systemBasePageScrollLeftRef = ref<number>()
  function onScroll({
    scrollLeft,
    scrollTop,
  }: {
    scrollTop?: number
    scrollLeft?: number
  }) {
    if ($route.meta.keepAlive) {
      _systemBasePageScrollTopRef.value = scrollTop
      _systemBasePageScrollLeftRef.value = scrollLeft
    }
  }

  onActivated(() => {
    if ($route.meta.keepAlive) {
      if (_systemBasePageScrollTopRef.value) {
        elScrollbarInstance.value.setScrollTop(
          _systemBasePageScrollTopRef.value
        )
      }
      if (_systemBasePageScrollLeftRef.value) {
        elScrollbarInstance.value.setScrollLeft(
          _systemBasePageScrollLeftRef.value
        )
      }
    }
  })
  return { onScroll }
}
