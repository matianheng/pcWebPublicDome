import { getCookie, setCookie, removeCookie } from 'typescript-cookie'

export function saveObjToLocalStorage<T>(key: string, obj: T) {
  localStorage.setItem(key, JSON.stringify(obj))
}
export function loadObjFromLocalStorage<T>(key: string): T | null {
  const val = localStorage.getItem(key)
  if (val) {
    return JSON.parse(val)
  }
  return null
}
export function clearLocalStorageByKey(key: string) {
  localStorage.removeItem(key)
}
export function clearLocalStorage() {
  localStorage.clear()
}
export function loadLocalStorageByKey(key: string) {
  return localStorage.getItem(key)
}
export function saveLocalStorage(key: string, val: string) {
  localStorage.setItem(key, val)
}

/**
 * 将数据存放到cookie中
 *
 * @param   {string}  key  [key description]
 * @param   {string}  val  [val description]
 *
 * @return  {[type]}       [return description]
 */
export function saveDataToCookie(key: string, val: string) {
  setCookie(key, val)
}

/**
 * 从cookie中获取数据
 *
 * @param   {string}  key  [key description]
 *
 * @return  {[type]}       [return description]
 */
export function loadDataFromCookie(key: string) {
  return getCookie(key)
}

/**
 * 删除指定cookie
 *
 * @param   {string}  key  [key description]
 *
 * @return  {[type]}       [return description]
 */
export function deleteCookie(key: string) {
  removeCookie(key)
}

/**
 * 清除所有cookie
 * @param {string} path 可选. 默认: /
 */
export function clearCookie(path = '/') {
  console.log(document.cookie)
  // eslint-disable-next-line
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie = `${keys[i]}=0;expires=${new Date(
        0
      ).toUTCString()};path=${path}`
    }
  }
}

export function clearAllStorage(cookiePath = '/') {
  clearCookie(cookiePath)
  sessionStorage.clear()
  localStorage.clear()
}
