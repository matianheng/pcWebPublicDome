export class AxiosCancelError extends Error {
  constructor({ cause, message }: { cause?: unknown; message?: string }) {
    super(message, { cause: cause })
  }
}
