import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Component, escape, platformHelp } from './utils'
import { platforms as _platforms, apps, Platform, common, qv2ray } from './data'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  repos: { getLatestRelease, listReleases },
} = new Octokit({ auth: GH_TOKEN })

const help = escape(outdent`
  *命令* \`/rel [应用] [版本]\`
  在命令后添加 \`beta\` 获取预发布版本
  *示例* \`/rel qv2ray win64 beta\`
  *应用*
  ${Object.entries(apps)
    .map(([app, { name }]) => `· \`${app}\` ${name}`)
    .join('\n')}
  *通用版本*
  ${platformHelp(common)}
  *Qv2ray 版本*
  ${platformHelp(qv2ray)}
`)

const latestRelease = async ({
  owner,
  repo,
  prerelease,
}: {
  owner: string
  repo: string
  prerelease?: boolean
}) => {
  if (prerelease) {
    const {
      data: [data],
    } = await listReleases({
      owner,
      repo,
      per_page: 1,
    })

    return data
  }

  const { data } = await getLatestRelease({
    owner,
    repo,
  })

  return data
}

export const release: Component = (telegraf) => {
  telegraf.hears(
    /^\/rel(?:@Qvreleasebot)?(?: (\w+) (\w+)( beta)?)?$/,
    async (ctx) => {
      const { match, reply, replyWithMarkdownV2, message } = ctx
      const extra = {
        reply_to_message_id: message!.message_id,
      }

      const [, app, platform, beta] = match!

      if (!app) return replyWithMarkdownV2(help, extra)

      if (!(app in apps)) return reply(`没有找到应用 ${app}！`, extra)
      const { name, owner, repo, prerelease, platforms } = apps[app]
      if (!(platform in platforms))
        return reply(`没有找到平台 ${platform}！`, extra)

      const { assets, tag_name, published_at } = await latestRelease({
        owner,
        repo,
        prerelease: prerelease || Boolean(beta),
      })

      const asset = assets.find((asset) =>
        asset.browser_download_url.includes(platforms[platform as Platform]!)
      )

      if (!asset) return reply('最新版本中没有相应文件！', extra)

      const github = asset.browser_download_url.replace(/_/g, '\\_')
      const fastgit = github.replace('github.com', 'download.fastgit.org')

      replyWithMarkdownV2(
        escape(outdent`
          *${name} ${tag_name}* (${_platforms[platform as Platform]}) \`${dayjs(
          published_at
        )
          .utcOffset(8)
          .format('YYYY-MM-DD HH:mm')}\`
          · [GitHub](${github})
          · [FastGit](${fastgit})
        `),
        extra
      )
    }
  )
}
