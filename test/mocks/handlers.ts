import { http, delay, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async () => {
    console.log('msw 请求拦截执行,延迟2秒')
    // 模拟延迟
    await delay(2000)
    console.log('msw 请求拦截执行,延迟执行完毕')
    return HttpResponse.json({
      status: 0,
      msg: '',
      data: '1',
    })
  }),
]
