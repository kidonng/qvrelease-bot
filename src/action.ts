import { Octokit } from '@octokit/rest'
import outdent from 'outdent'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import got from 'got'
import { Component, escape, sourceHelp, typeHelp, botInfo } from './utils'
import { platforms, workflows, common, Platform } from './data'

dayjs.extend(utc)

const { GH_TOKEN } = process.env

const {
  actions: { listWorkflowRuns, listWorkflowRunArtifacts },
} = new Octokit({ auth: GH_TOKEN })

const help = escape(outdent`
  *命令* \`/act [资源] [类型]\`
  *示例* \`/act qv2ray win64\`
  *资源*
  ${sourceHelp(workflows)}
  *类型*
  ${typeHelp(common)}
`)

export const action: Component = (telegraf) => {
  telegraf.hears(
    RegExp(`^/act(?:@${botInfo.username})?(?: (\\w+))?(?: (\\w+))?`),
    async (ctx) => {
      const { match, reply, replyWithMarkdownV2, message } = ctx
      const extra = {
        reply_to_message_id: message!.message_id,
      }

      const [, _source, _type] = match!
      const source = _source?.toLowerCase()
      const type = _type?.toLowerCase()

      if (!source) return replyWithMarkdownV2(help, extra)

      if (!workflows.hasOwnProperty(source))
        return reply(`资源 ${source} 不存在！`, extra)
      const { name, owner, repo, workflow_id, types } = workflows[source]
      if (!types.hasOwnProperty(type))
        return reply(`类型 ${type} 不存在！`, extra)

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
        return reply(
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
        replyWithMarkdownV2(
          escape(outdent`
          *${name}* (${platforms[type as Platform]}) \`${dayjs(created_at)
            .utcOffset(8)
            .format('YYYY-MM-DD HH:mm')}\`
          [${escape(artifactName)}](${link})
        `),
          extra
        )
      })
    }
  )
}
