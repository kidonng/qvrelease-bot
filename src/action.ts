import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import got from 'got'
import { Component, escape, sourceHelp, versionHelp } from './utils'
import { platforms, workflows, common, Platform } from './data'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  actions: { listWorkflowRuns, listWorkflowRunArtifacts },
} = new Octokit({ auth: GH_TOKEN })

const help = escape(outdent`
  *命令* \`/act [资源] [版本]\`
  *示例* \`/act qv2ray win64\`
  *资源*
  ${sourceHelp(workflows)}
  *版本*
  ${versionHelp(common)}
`)

export const action: Component = (telegraf) => {
  telegraf.hears(/^\/act(?:@Qvreleasebot)?(?: (\w+) (\w+))?$/i, async (ctx) => {
    const { match, reply, replyWithMarkdownV2, message } = ctx
    const extra = {
      reply_to_message_id: message!.message_id,
    }

    const [, _source, _version] = match!
    const source = _source?.toLowerCase()
    const version = _version?.toLowerCase()

    if (!source) return replyWithMarkdownV2(help, extra)

    if (!workflows.hasOwnProperty(source))
      return reply(`没有找到资源 ${source}！`, extra)
    const { name: _name, owner, repo, workflow_id, versions } = workflows[
      source
    ]
    if (!versions.hasOwnProperty(version))
      return reply(`没有找到版本 ${version}！`, extra)

    const {
      data: {
        workflow_runs: [{ id: run_id }],
      },
    } = await listWorkflowRuns({
      owner,
      repo,
      workflow_id,
    })

    const {
      data: { artifacts },
    } = await listWorkflowRunArtifacts({
      owner,
      repo,
      run_id,
    })

    const artifact = artifacts.find((artifact) =>
      artifact.name.includes(versions[version as Platform]!)
    )

    if (!artifact) return reply('未找到该版本文件！', extra)

    const { id: artifact_id, name, created_at } = artifact

    got(
      `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifact_id}/zip`,
      { headers: { Authorization: `token ${GH_TOKEN}` } }
    ).on('response', ({ redirectUrls: [link] }) => {
      replyWithMarkdownV2(
        escape(outdent`
          *${_name}* (${platforms[version as Platform]}) \`${dayjs(created_at)
          .utcOffset(8)
          .format('YYYY-MM-DD HH:mm')}\`
          [${escape(name)}](${link})
        `),
        extra
      )
    })
  })
}
