import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { flushPromises } from '@vue/test-utils'
import queryString from 'query-string'
import { delay } from 'msw'
describe('msw基础测试', () => {
  it('get请求-包含数组值的情况', async () => {
    const params = {
      kw: '你好',
      hobby: ['打篮球', '踢足球'],
    }
    const paramsStr = queryString.stringify(params, { arrayFormat: 'none' })
    console.log('paramsStr:', paramsStr)
    const resp = await axios.get(`/msw-api/get/31`, {
      params: params,
      // 配置这个是为了解决传递hobby这种多值参数问题. 如果你的目标浏览器是非IE浏览器, 那么可以用 query-string 库, 如果包含ie浏览器, 请使用 qs 库
      paramsSerializer: params => {
        return queryString.stringify(params, { arrayFormat: 'none' })
      },
    })
    await flushPromises()
    console.log('拿到的响应', resp.data)
    // 如果是通过vscode的vitest插件(zixuanchen.vitest-explorer)运行, 则必须加入这个延迟代码, 否则该插件不会等待代码执行完毕(不符合预期)。使用Vitest Runner插件(kingwl.vscode-vitest-runner)或命令行运行，代码会完整执行(符合预期)
    // await delay(2100)
  })
  it('post请求-request body传参', async () => {
    const resp = await axios.post('/msw-api/post', {
      name: '张三',
      id: 21,
      age: 33,
      hobby: ['打篮球', '踢足球'],
      male: true,
    })
    await flushPromises()
    console.log('拿到的响应', resp.data)
  })
  it('post请求-form传参', async () => {
    const formData: FormData = new FormData()
    formData.append('name', '张三')
    formData.append('id', '1')
    formData.append('hobby', '打篮球')
    formData.append('hobby', '踢足球')
    const resp = await axios.post('/msw-api/post/form', formData)
    await flushPromises()
    console.log('拿到的响应', resp.data)
  })
  it('post响应文件流', async () => {
    const resp = await axios.post('/msw-api/post/resp/stream')
    await flushPromises()
    console.log('拿到的响应', resp)
  })
})
