import { useLsyMenuBreadcrumbTabStore } from '@/store/LsyMenuBreadcrumbTabStore'
import { ElMessage } from 'element-plus'
import { Directive, nextTick } from 'vue'

interface CustomHTMLElement extends HTMLElement {
  _clickCall?: (evt: MouseEvent) => boolean | undefined
  // 存储原始的display方式
  originalDisplay?: string
}

/**
 * 自定义鉴权指令:
 * 自动获取当前路由对应的菜单项，判断当前菜单项是否有对应的权限标识
 *
 * 用法示例:
 *
 * @example
 *
 * ```
 * <button v-permission="'permissionFlag'" @click="sayHello">权限按钮(没权限则禁用)</button>
 * <button v-permission:hidden="'permissionFlag'" @click="sayHello">权限按钮(没权限则隐藏)</button>
 * <button v-permission:tips="'permissionFlag'" @click="sayHello">权限按钮(没权限给出tips提示)</button>
 * ```
 *
 * ```
 * <a v-permission="'permissionFlag'" @click="sayHello">权限按钮(没权限则禁用)</a>
 * <a v-permission:hidden="'permissionFlag'" @click="sayHello">权限按钮(没权限则隐藏)</a>
 * <a v-permission:tips="'permissionFlag'" @click="sayHello">权限按钮(没权限给出tips提示)</a>
 * ```
 *
 * ```
 * <span v-permission="'permissionFlag'" @click="sayHello">权限按钮(没权限则禁用)</span>
 * <span v-permission:hidden="'permissionFlag'" @click="sayHello">权限按钮(没权限则隐藏)</span>
 * <span v-permission:tips="'permissionFlag'" @click="sayHello">权限按钮(没权限给出tips提示)</span>
 * ```
 *
 * ```
 * <el-button v-permission="'permissionFlag'" @click="sayHello">权限按钮(没权限则禁用)</el-button>
 * <el-button v-permission:hidden="'permissionFlag'" @click="sayHello">权限按钮(没权限则隐藏)</el-button>
 * <el-button v-permission:tips="'permissionFlag'" @click="sayHello">权限按钮(没权限给出tips提示)</el-button>
 * ```
 *
 * ```
 * <MyButton v-permission="'permissionFlag'" @click="sayHello">权限按钮(没权限则禁用)</MyButton>
 * <MyButton v-permission:hidden="'permissionFlag'" @click="sayHello">权限按钮(没权限则隐藏)</MyButton>
 * <MyButton v-permission:tips="'permissionFlag'" @click="sayHello">权限按钮(没权限给出tips提示)</MyButton>
 * ```
 */
export const vPermission: Directive<CustomHTMLElement, string> = {
  created(el, binding, vnode, prevVnode) {
    const { value: permissionFlag, arg = 'disabled' } = binding
    doPermissionValidate(el, permissionFlag, arg)
  },
  updated(el, binding, vnode, prevVnode) {
    const { value: permissionFlag, arg = 'disabled' } = binding
    doPermissionValidate(el, permissionFlag, arg)
  },
  beforeUnmount(el, binding, vnode, prevVnode) {
    el._clickCall && el.removeEventListener('click', el._clickCall, false)
  },
}

function doPermissionValidate(
  el: CustomHTMLElement,
  permissionFlag: string,
  arg: string
) {
  const lsyMenuBreadcrumbTabStore = useLsyMenuBreadcrumbTabStore()
  const { hasPermission } = lsyMenuBreadcrumbTabStore
  let clickCall = el._clickCall as (evt: MouseEvent) => boolean | undefined
  if (!clickCall) {
    /**
     * 自定义的点击事件必须在一开始的时候就添加上去，保证鉴权事件在所有事件之前
     *
     */
    clickCall = (evt: MouseEvent) => {
      if (!hasPermission(permissionFlag)) {
        /*
          阻止事件冒泡且同时阻止同类事件的触发（如：原本可能绑定了多个click事件，
          stopImmediatePropagation执行之后能确保当前click事件之后的其他click事件都不会被触发）
           */
        evt.stopImmediatePropagation()
        evt.stopPropagation()
        evt.preventDefault()
        if (arg === 'tips') {
          ElMessage({
            showClose: true,
            message: '没权限执行该操作',
            type: 'warning',
          })
        }
        return false
      }
    }
    el.addEventListener('click', clickCall, false)
    el._clickCall = clickCall
  }
  if (!hasPermission(permissionFlag)) {
    // 之所以在nextTick中执行，是为了解决el-button这种UI库组件，样式设置不上去的问题
    nextTick(() => {
      if (!el.classList.contains('is-disabled')) {
        el.classList.add('is-disabled')
      }
    })
    switch (arg) {
      case 'hidden': {
        el.originalDisplay = el.style.display
        el.style.display = 'none'
        break
      }
      case 'disabled': {
        // 之所以在nextTick中执行，是为了解决el-button这种UI库组件，属性设置不上去的问题
        nextTick(() => {
          el.setAttribute('disabled', 'disabled')
        })
      }
    }
  } else {
    if (el.style.display === 'none') {
      el.style.display = 'block'
    }
    if (el.style.visibility === 'hidden') {
      el.style.visibility = 'visible'
    }
    if (el.getAttribute('disabled')) {
      el.removeAttribute('disabled')
    }
    el.classList.remove('is-disabled')
  }
}
