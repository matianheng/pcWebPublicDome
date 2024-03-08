import { join } from 'path'
import { defineMock } from 'vite-plugin-mock-dev-server'
import { createReadStream, statSync } from 'fs'
import path from 'path'

export default defineMock([
  {
    url: '/local-mock-api/data-export/suc',
    method: 'POST',
    status: 200,
    delay: 1500,
    response: (req, res, next) => {
      // 设置下载的文件名
      const fileName = encodeURIComponent('表格.xlsx')
      // 获取待下载文件完整路径
      const filePath = path.resolve(join('local-mock', 'test.xlsx'))
      const readStream = createReadStream(filePath)
      const stats = statSync(filePath)
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': 'attachment; filename=' + fileName,
        'Content-Length': stats.size,
      })
      readStream.pipe(res)
    },
  },
  {
    url: '/local-mock-api/data-export/exp',
    method: 'POST',
    status: 200,
    delay: 500,
    body: {
      status: 1,
      msg: '我是后端文件下载接口抛出的异常',
    },
  },
  {
    url: '/local-mock-api/pdf',
    method: 'POST',
    status: 200,
    delay: 1500,
    response: (req, res, next) => {
      // 设置下载的文件名
      const fileName = encodeURIComponent('测试pdf.xlsx')
      // 获取待下载文件完整路径
      const filePath = path.resolve(join('local-mock', 'test.pdf'))
      const readStream = createReadStream(filePath)
      const stats = statSync(filePath)
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': 'attachment; filename=' + fileName,
        'Content-Length': stats.size,
      })
      readStream.pipe(res)
    },
  },
])
