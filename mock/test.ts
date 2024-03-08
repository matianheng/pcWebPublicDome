import { MockMethod } from 'vite-plugin-mock'
import { mock, Random } from 'mockjs'
import { buildPageData, incrementIdFromQueryParam } from './mockUtil'
const prefix = '/mock-api'
export default [
  {
    url: `${prefix}/load-data`, // 注意，这里只能是string格式
    method: 'get',
    response: ({ query }) => {
      const map = new Map()
      const incrementCall = incrementIdFromQueryParam(query)
      map.set(`list|${query.size}`, [
        {
          // title: '@ctitle(5, 25)',
          author: '@cname()',
          // content: '@cparagraph(2,4)',
          // id:"@id",
          date: '@date("yyyy-MM-dd")',
          'pic|1-36': 1,
          lenTitle: '@ctitle(16)',
          'talkCount|1-9000': 1,
        },
      ])
      const tmpObj = [...map.entries()].reduce(
        (obj, [key, value]) => ((obj[key] = value), obj),
        {}
      )
      const obj = mock(tmpObj) as any
      obj.list = (obj.list as any[]).map(item => ({
        ...item,
        idx: incrementCall(),
      }))
      return buildPageData(obj.list, 150, query)
    },
  },
] as MockMethod[] // 这里其实就是定义数据格式的，不了解的同学可以参考typescript的官方文档
