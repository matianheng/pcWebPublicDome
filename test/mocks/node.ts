import { setupServer } from 'msw/node'
import { handlers } from './handlers.ts'
import { mswHandlers } from './msw-handlers.ts'
import { uploadHandlers } from './upload-file-handlers.ts'

export const server = setupServer(
  ...handlers,
  ...mswHandlers,
  ...uploadHandlers
)
