import { ElNotification } from 'element-plus'
import { createVNode } from 'vue'
import UpdateTips from './UpdateTips.vue'

let lastSrcs: string[] | undefined //上一次获取到的script地址
let needCheck = true // 是否需要检测服务器文件是否更新

const scriptReg = /<script.*src=["'](?<src>[^"']+)/gm

async function extractNewScripts() {
  const html = await fetch(
    `${import.meta.env.VITE_PUBLIC_BASEPATH}?_timestamp=` + Date.now()
  ).then(resp => resp.text())
  scriptReg.lastIndex = 0
  const result: string[] = []
  let match: RegExpExecArray | null = null
  while ((match = scriptReg.exec(html))) {
    if (match && match.groups) {
      result.push(match.groups.src)
    }
  }
  return result
}

async function needUpdate() {
  const newScripts = await extractNewScripts()
  console.log(newScripts)
  if (!lastSrcs) {
    lastSrcs = newScripts
    return false
  }
  let result = false
  if (lastSrcs.length !== newScripts.length) {
    result = true
  }
  for (let i = 0; i < lastSrcs.length; i++) {
    if (lastSrcs[i] !== newScripts[i]) {
      result = true
      break
    }
  }
  lastSrcs = newScripts
  return result
}
function checkUpdate() {
  setTimeout(async () => {
    const willUpdate = await needUpdate()
    if (willUpdate) {
      ElNotification.success({
        title: '系统提示',
        message: createVNode(UpdateTips),
        showClose: false,
        duration: 0,
        customClass: 'o-check-system-update-notify',
      })
      needCheck = false // 关闭更新提示，防止重复提醒
    }
    if (needCheck) {
      checkUpdate()
    }
  }, 30000)
}
if (import.meta.env.MODE !== 'development') {
  checkUpdate()
}
