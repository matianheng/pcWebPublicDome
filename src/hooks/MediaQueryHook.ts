import { onBeforeUnmount } from 'vue'

/**
 * 进行设备特性监听, 并在匹配成功时和匹配失败时, 执行回调函数
 * @param mediaQuery 媒体查询语句
 * @param matchesCallback 匹配成功时的回调函数
 * @param notMatchesCallback 匹配失败时的回调函数
 */
export function useMediaQuery(
  mediaQuery: string,
  matchesCallback: () => void,
  notMatchesCallback?: () => void
) {
  const mql: MediaQueryList = window.matchMedia(mediaQuery)
  function screenTypeChange(evt: MediaQueryListEvent | MediaQueryList) {
    if (evt.matches) {
      matchesCallback()
    } else {
      notMatchesCallback && notMatchesCallback()
    }
  }
  screenTypeChange(mql)
  mql.addEventListener('change', screenTypeChange)
  onBeforeUnmount(() => {
    mql.removeEventListener('change', screenTypeChange)
  })
}
