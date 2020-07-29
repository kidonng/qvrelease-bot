import { Telegraf, Context } from 'telegraf/typings'
import { ExtraEditMessage } from 'telegraf/typings/telegram-types'
import { MiddlewareFn } from 'telegraf/typings/composer'
import { NowResponse } from '@vercel/node'

export interface IContext extends Context {
  replyWithMarkdownV2(
    markdown: string,
    extra?: ExtraEditMessage
  ): MiddlewareFn<IContext>
}

export interface Component {
  (telegraf: Telegraf<IContext>): void
}

// https://stackoverflow.com/a/60145565
export const escape = (text: string) =>
  text.replace(/(\[[^\][]*]\(http[^()]*\))|[[\]()>#+\-=|{}.!]/gi, (x, y) =>
    y ? y : '\\' + x
  )

export const request: { handler?: NowResponse } = {}
