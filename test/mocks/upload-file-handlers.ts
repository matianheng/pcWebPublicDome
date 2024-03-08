import { http, delay, HttpResponse } from 'msw'

export const uploadHandlers = [
  http.post('/api/person/upload', async () => {
    return HttpResponse.json({
      status: 0,
      msg: '',
      data: 'http://dummyimage.com/200x100/4A7BF7&text=Hello',
    })
  }),
]
