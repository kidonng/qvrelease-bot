import { UserFromGetMe } from 'typegram'
import { Octokit } from '@octokit/rest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Platforms, Platform, platforms, sources, workflows } from './data'

export const { GH_TOKEN } = process.env
export const octokit = new Octokit({ auth: GH_TOKEN })

dayjs.extend(utc)
export const formatTime = (time: string) =>
  dayjs(time).utcOffset(8).format('YYYY-MM-DD HH:mm')

// https://stackoverflow.com/a/60145565
export const escape = (text: string) =>
  text.replace(/(\[[^\][]*]\(http[^()]*\))|[[\]()>#+\-=|{}.!]/gi, (x, y) =>
    y ? y : '\\' + x
  )

export const botInfo: Partial<UserFromGetMe> = {}

export const sourceHelp = (_sources: typeof sources | typeof workflows) =>
  Object.entries(_sources)
    .map(([app, { name }]) => `· \`${app}\` ${name}`)
    .join('\n')

export const typeHelp = (types: Platforms) =>
  Object.keys(types)
    .map((platform) => `· \`${platform}\` ${platforms[platform as Platform]}`)
    .join('\n')
