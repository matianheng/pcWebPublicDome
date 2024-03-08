import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import zhCN from './local-data/zh-CN.json'
import enUS from './local-data/en-US.json'
import { dateTimeFormats, numberFormats } from './i18nFormat'
const sharedMessages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export const i18n = createI18n({
  dateTimeFormats,
  // 当前语言
  locale: 'zh-CN',
  // 当语言资源不存在时，使用的默认替换语言
  fallbackLocale: 'zh-CN',
  // 通过composition api方式使用，则需要将legacy设置为false
  legacy: false,
  messages: sharedMessages,
  numberFormats,
})

/**
 * 切换语言环境
 *
 * @param   {string}  locale  语言标识
 *
 * @return  {[type]}          [return description]
 */
export function setI18nLanguage(locale: string) {
  if (i18n.mode === 'legacy') {
    // @ts-ignore
    i18n.global.locale = locale
  } else {
    // @ts-ignore
    i18n.global.locale.value = locale
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.documentElement.setAttribute('lang', locale)
}

/**
 * 动态加载多语言资源
 *
 * @param   {string}  locale  语言标识(不传则加载 zh-CN )
 *
 */
export async function loadLocaleMessages(locale = 'zh-CN') {
  // 这里可以换成axios从服务器加载
  console.log(`加载多语言资源: ${locale}`)
  const messages = await import(`./i18n/lang/${locale}.json`)
  // 用新的语言数据覆盖已有的语言数据（要使用哪种自己选择）
  //  i18n.global.setLocaleMessage(locale, messages.default)
  //  i18n.global.mergeLocaleMessage(locale, messages.default)
  return nextTick()
}
