import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Component, escape } from './utils'
import { platforms as _platforms, apps, Platform } from './data'
import { help } from './help'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  repos: { getLatestRelease },
} = new Octokit({ auth: GH_TOKEN })

export const release: Component = (telegraf) => {
  telegraf.hears(/\/qv (\w+)(?: (\w+))?/, async (ctx) => {
    const { match, reply, replyWithMarkdownV2, message } = ctx
    const extra = {
      reply_to_message_id: message!.message_id,
    }

    const [, app, platform] = match!

    if (app === 'help') return help(ctx)

    if (!(app in apps)) return reply(`没有找到应用 ${app}！`, extra)
    const { name, repo, platforms } = apps[app]
    if (!(platform in platforms))
      return reply(`没有找到平台 ${platform}！`, extra)

    const {
      data: { assets, tag_name, published_at },
    } = await getLatestRelease({
      owner: 'Qv2ray',
      repo,
    })

    const asset = assets.find((asset) =>
      asset.browser_download_url.includes(platforms[platform as Platform]!)
    )

    if (!asset) return reply('最新版本中没有相应文件！', extra)

    replyWithMarkdownV2(
      escape(outdent`
          *${name} ${tag_name}* (${_platforms[platform as Platform]}) \`${dayjs(
        published_at
      )
        .utcOffset(8)
        .format('YYYY-MM-DD HH:mm')}\`
          ${asset.browser_download_url.replace(/_/g, '\\_')}
        `),
      extra
    )
  })
}
