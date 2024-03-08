import { debounce } from 'lodash-unified'

/*
通过此方式修复: ResizeObserver loop limit exceeded

https://www.cnblogs.com/echohye/p/17862450.html

https://blog.csdn.net/gudeng007/article/details/125765927

https://juejin.cn/s/antd%20table%20resizeobserver%20loop%20limit%20exceeded
*/

const _ResizeObserver = window.ResizeObserver
// @ts-ignore
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback: () => void) {
    callback = debounce(callback, 20)
    super(callback)
  }
}
