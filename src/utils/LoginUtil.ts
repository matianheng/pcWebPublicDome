import {
  clearAllStorage,
  loadDataFromCookie,
  saveDataToCookie,
} from './StorageUtil'
import { isNotNullAndNotUndefined } from './TypeUtils'

const login_flag = 'loginFlag'
/**
 * 保存登录标识
 * @param loginFlag 登录标识
 * @returns 返回true表示登录标识保存成功，否则表示保存失败
 */
export function saveLoginResult(loginFlag?: string) {
  if (isNotNullAndNotUndefined(loginFlag)) {
    //@ts-ignore
    saveDataToCookie(login_flag, loginFlag)
    return true
  }
  return false
}
/**
 * 获取登录标识
 */
export function getLoginFlag(): string | undefined {
  return loadDataFromCookie(login_flag)
}
/**
 * 判断是否有登录
 */
export function isLogin() {
  return !!getLoginFlag()
}
export function clearLoginData() {
  clearAllStorage()
}
