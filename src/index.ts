import { Telegraf } from 'telegraf'
import { botInfo } from './utils'

const { BOT_TOKEN, IS_VERCEL } = process.env

export const telegraf = new Telegraf(BOT_TOKEN!)
require('./action')
require('./release')

if (!IS_VERCEL) {
  telegraf.telegram.webhookReply = false

  telegraf.telegram.getMe().then((user) => {
    Object.assign(botInfo, user)
    telegraf.launch()
  })
}
