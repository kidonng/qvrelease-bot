import outdent from 'outdent'
import { telegraf } from '.'
import {
  botInfo,
  escape,
  sourceHelp,
  typeHelp,
  octokit,
  formatTime,
} from './utils'
import { platforms, sources, Platform, common, qv2ray } from './data'

const {
  repos: { listReleases },
} = octokit

const help = escape(outdent`
  *命令* \`/rel [资源] [类型]\`
  在命令后添加 \`pre\` 获取预发布版本
  *示例* \`/rel qv2ray win64 pre\`
  *资源*
  ${sourceHelp(sources)}
  *类型*
  ${typeHelp(common)}
  *Qv2ray 额外类型*
  ${typeHelp(qv2ray)}
`)

telegraf.hears(
  RegExp(`^/rel(?:@${botInfo.username})?(?: (\\w+))?(?: (\\w+))?( pre)?`, 'i'),
  async (ctx) => {
    const extra = {
      reply_to_message_id: ctx.message!.message_id,
    }

    const [, _source, _type, pre] = ctx.match!
    const source = _source?.toLowerCase()
    const type = _type?.toLowerCase()

    if (!source) return ctx.replyWithMarkdownV2(help, extra)

    if (!sources.hasOwnProperty(source))
      return ctx.reply(`资源 ${source} 不存在！`, extra)
    const { name, owner, repo, prerelease, types } = sources[source]
    if (typeof types === 'object' && !types.hasOwnProperty(type))
      return ctx.reply(`类型 ${type} 不存在！`, extra)

    const { data: releases } = await listReleases({
      owner,
      repo,
    })
    const [{ assets, tag_name, published_at }] = releases
      .filter((release) => !release.draft)
      .filter((release) =>
        prerelease || pre ? release.prerelease : !release.prerelease
      )

    const asset = assets.find((asset) =>
      asset.browser_download_url.includes(
        typeof types === 'string' ? types : types[type as Platform]!
      )
    )

    if (!asset)
      return ctx.reply(
        `未在 https://github.com/${owner}/${repo}/releases/${tag_name} 版本中找到此类型文件！`,
        {
          ...extra,
          disable_web_page_preview: true,
        }
      )

    const github = asset.browser_download_url.replace(/_/g, '\\_')
    const fastgit = github.replace('github.com', 'download.fastgit.org')

    ctx.replyWithMarkdownV2(
      escape(outdent`
          *${name}${
        type ? ` ${platforms[type as Platform]}` : ''
      }* (${tag_name}${prerelease || pre ? ' pre' : ''}) \`${formatTime(
        published_at!
      )}\`
          · [GitHub](${github})
          · [FastGit](${fastgit})
        `),
      extra
    )
  }
)
