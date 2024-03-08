/**
 * 系统主侧边栏[展开后]宽度(这里用的是tailwind中的单位, 1个单位表示4px, 因此56表示224px)
 *
 * p.s. 不要将该变量提取到独立文件, 因为 tailwind.config.ts 的 safelist 配置用到了，因此会解析这些变量，但它又无法识别别名，因此会报错，因此只能放在当前文件
 */
const systemSideWidth = '56'
/**
 * 系统主侧边栏[收缩后]宽度
 *
 * p.s. 不要将该变量提取到独立文件, 因为 tailwind.config.ts 的 safelist 配置用到了，因此会解析这些变量，但它又无法识别别名，因此会报错，因此只能放在当前文件
 */
const systemSideMinWidth = '14'
/**
 * 系统页头高度(这里用的是tailwind中的单位, 1个单位表示4px, 因此12表示48px)
 *
 * p.s. 不要将该变量提取到独立文件, 因为 tailwind.config.ts 的 safelist 配置用到了，因此会解析这些变量，但它又无法识别别名，因此会报错，因此只能放在当前文件
 */
const systemHeaderHeight = '12'

/**
 * 这些动态的样式, tailwind css无法解析，因此必须将这些动态样式的实际值，配置到 tailwind.config.cjs 文件的 safelist 属性中, 让 tailwind css 默认就生成这些样式
 *
 * p.s. 不要将该变量提取到独立文件, 因为 tailwind.config.ts 的 safelist 配置用到了，因此会解析这些变量，但它又无法识别别名，因此会报错，因此只能放在当前文件
 */
export const tailwindSafetyListObj = {
  leftSystemSideWidth: `left-${systemSideWidth}`,
  leftSystemSideMinWidth: `left-${systemSideMinWidth}`,
  /**
   * 系统侧边默认宽度
   */
  wSystemSideWidth: `w-${systemSideWidth}`,
  /**
   * 系统侧边最小宽度(收缩后的宽度)
   */
  wSystemSideMinWidth: `w-${systemSideMinWidth}`,
  topSystemHeaderHeight: `top-${systemHeaderHeight}`,
  ptSystemHeaderHeight: `pt-${systemHeaderHeight}`,
  /**
   * 系统侧边默认padding-left
   */
  plSystemSideWidth: `pl-${systemSideWidth}`,
  /**
   * 系统侧边最小padding-left
   */
  plSystemSideMinWidth: `pl-${systemSideMinWidth}`,
  /**
   * 系统头部高度
   */
  hSystemHeaderHeight: `h-${systemHeaderHeight}`,
}
/**
 * 生成 tailwind.config.ts 的 safelist 配置值
 */
export const tailwindSafetyList = (() => Object.values(tailwindSafetyListObj))()
