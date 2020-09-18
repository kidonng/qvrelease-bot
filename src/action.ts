import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import got from 'got'
import { Component, escape } from './utils'
import { platforms as _platforms, workflows, common, Platform } from './data'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  actions: { listWorkflowRuns, listWorkflowRunArtifacts },
} = new Octokit({ auth: GH_TOKEN })

const help = escape(outdent`
  *命令* \`/act [编译目标] [版本]\`
  *示例* \`/act cmake win64\`
  *编译目标*
  ${Object.keys(workflows)
    .map((app) => `· \`${app}\``)
    .join('\n')}
  *版本*
  ${Object.entries(_platforms)
    .filter(([platform]) => platform in common)
    .map(([platform, name]) => `· \`${platform}\` ${name}`)
    .join('\n')}
`)

export const action: Component = (telegraf) => {
  telegraf.hears(/^\/act(?:@Qvreleasebot)?(?: (\w+) (\w+))?$/, async (ctx) => {
    const { match, reply, replyWithMarkdownV2, message } = ctx
    const extra = {
      reply_to_message_id: message!.message_id,
    }

    const [, workflow, platform] = match!

    if (!workflow) return replyWithMarkdownV2(help, extra)

    if (!(workflow in workflows))
      return reply(`没有找到编译目标 ${workflow}！`, extra)
    const { owner, repo, workflow_id, platforms } = workflows[workflow]
    if (!(platform in platforms))
      return reply(`没有找到平台 ${platform}！`, extra)

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
      artifact.name.includes(platforms[platform as Platform]!)
    )

    if (!artifact) return reply('最新版本中没有相应文件！', extra)

    const { id: artifact_id, name, created_at } = artifact

    got(
      `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${artifact_id}/zip`,
      { headers: { Authorization: `token ${GH_TOKEN}` } }
    ).on('response', ({ redirectUrls: [link] }) => {
      replyWithMarkdownV2(
        escape(outdent`
          *${workflow}* (${_platforms[platform as Platform]}) \`${dayjs(
          created_at
        )
          .utcOffset(8)
          .format('YYYY-MM-DD HH:mm')}\`
          [${escape(name)}](${link})
        `),
        extra
      )
    })
  })
}
