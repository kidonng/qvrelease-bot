import outdent from 'outdent'
import { IContext, escape } from './utils'
import { platforms, apps } from './data'

export const help = ({ replyWithMarkdownV2 }: IContext) => {
  replyWithMarkdownV2(
    escape(outdent`
      *命令* \`/qv [应用] [平台]\`
      *应用*
      ${Object.entries(apps)
        .map(([app, { name }]) => `- \`${app}\` ${name}`)
        .join('\n')}
      *平台*
      ${Object.entries(platforms)
        .map(([platform, name]) => `- \`${platform}\` ${name}`)
        .join('\n')}
    `)
  )
}
