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
  repos: { getLatestRelease, listReleases },
} = new Octokit({ auth: GH_TOKEN })

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
  telegraf.hears(/^\/qv(?:@Qvreleasebot)?(?: (\w+) (\w+))?$/, async (ctx) => {
    const { match, reply, replyWithMarkdownV2, message } = ctx
    const extra = {
      reply_to_message_id: message!.message_id,
    }

    const [, app, platform] = match!

    if (!app) return replyWithMarkdownV2(help, extra)

    if (!(app in apps)) return reply(`没有找到应用 ${app}！`, extra)
    const { name, owner, repo, prerelease, platforms } = apps[app]
    if (!(platform in platforms))
      return reply(`没有找到平台 ${platform}！`, extra)

    const { assets, tag_name, published_at } = await latestRelease({
      owner,
      repo,
      prerelease,
    })

    const asset = assets.find((asset) =>
      asset.browser_download_url.includes(platforms[platform as Platform]!)
    )

    if (!asset) return reply('最新版本中没有相应文件！', extra)

    const github = asset.browser_download_url.replace(/_/g, '\\_')
    const fastgit = github.replace('github.com', 'hub.fastgit.org')

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
  })
}
