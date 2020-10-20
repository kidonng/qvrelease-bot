import Telegraf from 'telegraf'
import { action } from './action'
import { fallback } from './fallback'
import { release } from './release'
import { IContext, botInfo } from './utils'

const { BOT_TOKEN, IS_VERCEL } = process.env

export const telegraf = new Telegraf<IContext>(BOT_TOKEN!)
export const register = () => {
  const components = [release, action, fallback]
  for (const component of components) component(telegraf)
}

if (!IS_VERCEL) {
  telegraf.webhookReply = false

  telegraf.telegram.getMe().then((user) => {
    Object.assign(botInfo, user)
    register()
    telegraf.launch()
  })
}
