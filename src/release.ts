import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Component, escape, sourceHelp, versionHelp } from './utils'
import { platforms, sources, Platform, common, qv2ray } from './data'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  repos: { getLatestRelease, listReleases },
} = new Octokit({ auth: GH_TOKEN })

const help = escape(outdent`
  *命令* \`/rel [资源] [版本]\`
  在命令后添加 \`beta\` 获取预发布版本
  *示例* \`/rel qv2ray win64 beta\`
  *资源*
  ${sourceHelp(sources)}
  *通用版本*
  ${versionHelp(common)}
  *Qv2ray 版本*
  ${versionHelp(qv2ray)}
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
    /^\/rel(?:@Qvreleasebot)?(?: (\w+))?(?: (\w+))?( beta)?$/i,
    async (ctx) => {
      const { match, reply, replyWithMarkdownV2, message } = ctx
      const extra = {
        reply_to_message_id: message!.message_id,
      }

      const [, _source, _version, beta] = match!
      const source = _source?.toLowerCase()
      const version = _version?.toLowerCase()

      if (!source) return replyWithMarkdownV2(help, extra)

      if (!sources.hasOwnProperty(source))
        return reply(`没有找到资源 ${source}！`, extra)
      const { name, owner, repo, prerelease, versions } = sources[source]
      if (typeof versions === 'object' && !versions.hasOwnProperty(version))
        return reply(`没有找到版本 ${version}！`, extra)

      const { assets, tag_name, published_at } = await latestRelease({
        owner,
        repo,
        prerelease: prerelease || Boolean(beta),
      })

      const asset = assets.find((asset) =>
        asset.browser_download_url.includes(
          typeof versions === 'string'
            ? versions
            : versions[version as Platform]!
        )
      )

      if (!asset) return reply('未找到该版本文件！', extra)

      const github = asset.browser_download_url.replace(/_/g, '\\_')
      const fastgit = github.replace('github.com', 'download.fastgit.org')

      replyWithMarkdownV2(
        escape(outdent`
          *${name}${
          version ? ` ${platforms[version as Platform]}` : ''
        }* (${tag_name}${beta ? beta : ''}) \`${dayjs(published_at)
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
