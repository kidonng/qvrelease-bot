import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Component, escape, sourceHelp, typeHelp } from './utils'
import { platforms, sources, Platform, common, qv2ray } from './data'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  repos: { getLatestRelease, listReleases },
} = new Octokit({ auth: GH_TOKEN })

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
    /^\/rel(?:@Qvreleasebot)?(?: (\w+))?(?: (\w+))?( pre)?$/i,
    async (ctx) => {
      const { match, reply, replyWithMarkdownV2, message } = ctx
      const extra = {
        reply_to_message_id: message!.message_id,
      }

      const [, _source, _type, pre] = match!
      const source = _source?.toLowerCase()
      const type = _type?.toLowerCase()

      if (!source) return replyWithMarkdownV2(help, extra)

      if (!sources.hasOwnProperty(source))
        return reply(`资源 ${source} 不存在！`, extra)
      const { name, owner, repo, prerelease, types } = sources[source]
      if (typeof types === 'object' && !types.hasOwnProperty(type))
        return reply(`类型 ${type} 不存在！`, extra)

      const {
        assets,
        tag_name,
        published_at,
        prerelease: isPrerelease,
      } = await latestRelease({
        owner,
        repo,
        prerelease: prerelease || Boolean(pre),
      })

      const asset = assets.find((asset) =>
        asset.browser_download_url.includes(
          typeof types === 'string' ? types : types[type as Platform]!
        )
      )

      if (!asset) return reply(`未在 ${tag_name} 版本中找到此类型文件！`, extra)

      const github = asset.browser_download_url.replace(/_/g, '\\_')
      const fastgit = github.replace('github.com', 'download.fastgit.org')

      replyWithMarkdownV2(
        escape(outdent`
          *${name}${
          type ? ` ${platforms[type as Platform]}` : ''
        }* (${tag_name}${pre && isPrerelease ? ' pre' : ''}) \`${dayjs(
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
