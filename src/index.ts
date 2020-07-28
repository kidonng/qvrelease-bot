import Telegraf from 'telegraf'
import { release } from './release'
import { IContext } from './utils'

const { BOT_TOKEN, IS_VERCEL } = process.env

if (!BOT_TOKEN)
  throw Error('Please provide BOT_TOKEN as an environment variable')

export const telegraf = new Telegraf<IContext>(BOT_TOKEN)

release(telegraf)

telegraf.on('message', async (ctx) => {
  // Workaround for skipping unhandled messages
  // https://github.com/telegraf/telegraf/issues/1089
  const { telegram } = ctx
  if (telegram.webhookReply) {
    const { url } = await telegram.getWebhookInfo()
    await telegram.deleteWebhook()
    await telegram.getUpdates()
    return telegram.setWebhook(url)
  }
})

if (!IS_VERCEL) telegraf.launch()
