import { Component, handlers } from './utils'

export const fallback: Component = (telegraf) => {
  telegraf.on('message', (ctx) => {
    const { message } = handlers
    if (message) {
      delete handlers.message
      return message(ctx)
    }

    // Workaround for skipping unhandled messages
    // https://github.com/telegraf/telegraf/issues/1089
    if (ctx.telegram.webhookReply) {
      handlers.response!.status(200).end()
    }
  })
}
