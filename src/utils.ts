import { Telegraf, Context } from 'telegraf/typings'
import { ExtraEditMessage } from 'telegraf/typings/telegram-types'
import { MiddlewareFn } from 'telegraf/typings/composer'
import { NowResponse } from '@vercel/node'
import { Platforms, Platform, platforms, sources, workflows } from './data'

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

export const sourceHelp = (_sources: typeof sources | typeof workflows) =>
  Object.entries(_sources)
    .map(([app, { name }]) => `· \`${app}\` ${name}`)
    .join('\n')
export const typeHelp = (types: Platforms) =>
  Object.keys(types)
    .map((platform) => `· \`${platform}\` ${platforms[platform as Platform]}`)
    .join('\n')
