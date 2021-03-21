import outdent from 'outdent'
import got from 'got'
import { telegraf } from '.'
import {
  escape,
  sourceHelp,
  typeHelp,
  botInfo,
  GH_TOKEN,
  octokit,
  formatTime,
} from './utils'
import { platforms, workflows, common, Platform } from './data'

const {
  actions: { listWorkflowRuns, listWorkflowRunArtifacts },
} = octokit

const help = escape(outdent`
  *命令* \`/act [资源] [类型]\`
  *示例* \`/act qv2ray win64\`
  *资源*
  ${sourceHelp(workflows)}
  *类型*
  ${typeHelp(common)}
`)

telegraf.hears(
  RegExp(`^/act(?:@${botInfo.username})?(?: (\\w+))?(?: (\\w+))?`),
  async (ctx) => {
    const extra = {
      reply_to_message_id: ctx.message!.message_id,
    }

    const [, _source, _type] = ctx.match!
    const source = _source?.toLowerCase()
    const type = _type?.toLowerCase()

    if (!source) return ctx.replyWithMarkdownV2(help, extra)

    if (!workflows.hasOwnProperty(source))
      return ctx.reply(`资源 ${source} 不存在！`, extra)
    const { name, owner, repo, workflow_id, types } = workflows[source]
    if (!types.hasOwnProperty(type))
      return ctx.reply(`类型 ${type} 不存在！`, extra)

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
      artifact.name.includes(types[type as Platform]!)
    )

    if (!artifact)
      return ctx.reply(
        `未在 https://github.com/${owner}/${repo}/actions/runs/${run_id} 中找到此类型文件！`,
        {
          ...extra,
          disable_web_page_preview: true,
        }
      )

    const { id, name: artifactName, created_at } = artifact

    got(
      `https://api.github.com/repos/${owner}/${repo}/actions/artifacts/${id}/zip`,
      { headers: { Authorization: `token ${GH_TOKEN}` } }
    ).on('response', ({ redirectUrls: [link] }) => {
      ctx.replyWithMarkdownV2(
        escape(outdent`
          *${name}* (${platforms[type as Platform]}) \`${formatTime(
          created_at
        )}\`
          [${escape(artifactName)}](${link})
        `),
        extra
      )
    })
  }
)
