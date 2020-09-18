import Telegraf from 'telegraf'
import { release } from './release'
import { action } from './action'
import { IContext, request } from './utils'

const { BOT_TOKEN, IS_VERCEL } = process.env

if (!BOT_TOKEN)
  throw Error('Please provide BOT_TOKEN as an environment variable')

export const telegraf = new Telegraf<IContext>(BOT_TOKEN)

release(telegraf)
action(telegraf)

telegraf.on('message', ({ telegram }) => {
  // Workaround for skipping unhandled messages
  // https://github.com/telegraf/telegraf/issues/1089
  if (telegram.webhookReply) {
    request.handler!.status(200).end()
  }
})

if (!IS_VERCEL) {
  telegraf.webhookReply = false
  telegraf.launch()
}
