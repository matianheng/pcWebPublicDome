import { http, delay, HttpResponse } from 'msw'
import { createReadStream } from 'fs'

export const mswHandlers = [
  http.get('/msw-api/get/:id', async ({ request, params, cookies }) => {
    console.log(request, params, cookies)
    console.log('msw 请求拦截执行,延迟2秒')
    const url = new URL(request.url)
    // Given "/product?id=1", "productId" will equal "1".
    const { id } = params
    const kw = url.searchParams.get('kw')
    const hobbyArr = url.searchParams.getAll('hobby')
    // 模拟延迟
    await delay(2000)
    console.log('msw 请求拦截执行,延迟执行完毕')
    return HttpResponse.json({
      status: 0,
      msg: '',
      data: { id, hobbyArr, kw },
    })
  }),
  http.post('/msw-api/post', async ({ request, params, cookies }) => {
    console.log(request, params, cookies)
    const newPost = await request.json()
    console.log('msw 请求拦截执行,延迟2秒')
    console.log('body参数', newPost)
    // 模拟延迟
    await delay(2000)
    console.log('msw 请求拦截执行,延迟执行完毕')
    return HttpResponse.json({
      status: 0,
      msg: '',
      data: newPost,
    })
  }),
  http.post('/msw-api/post/form', async ({ request, params, cookies }) => {
    console.log('msw 请求拦截执行,延迟2秒')
    const formData = await request.formData()
    console.log('formData', formData)
    console.log('name', formData.get('name'))
    console.log('id', formData.get('id'))
    console.log('hobby', formData.getAll('hobby'))
    // 模拟延迟
    await delay(2000)
    console.log('msw 请求拦截执行,延迟执行完毕')
    return HttpResponse.json({
      status: 0,
      msg: '',
      data: '1',
    })
  }),
  /**
   * 响应流
   */
  http.post('/msw-api/post/resp/stream', async () => {
    console.log('msw 请求拦截执行,延迟2秒')
    // 模拟延迟
    await delay(2000)
    console.log('msw 请求拦截执行,延迟执行完毕')
    // 读取本地文件
    const readStream = createReadStream('./mocks/test.xlsx')
    // 将 ReadStream 转换为 ReadableStream
    const browserReadableStream = new ReadableStream({
      start(controller) {
        readStream
          .on('data', chunk => controller.enqueue(chunk))
          .on('end', () => controller.close())
          .on('error', err => controller.error(err))
      },
    })
    return new HttpResponse(browserReadableStream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${encodeURI(
          '文件名.xlsx'
        )}`,
      },
    })
  }),
]
