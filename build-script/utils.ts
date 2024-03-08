import path from 'path'

export function _resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

/**
 * val值是否为字符串'true'
 *
 * @param   {string}  val  [val description]
 *
 * @return  {[type]}       [return description]
 */
export function envStrValIsTrue(val: string | undefined | null) {
  return val === 'true'
}
