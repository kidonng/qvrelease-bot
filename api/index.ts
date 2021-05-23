import { VercelRequest, VercelResponse } from '@vercel/node'
import { telegraf, loadModules } from '../src'
import { botInfo } from '../src/utils'

export default async ({ body }: VercelRequest, res: VercelResponse) => {
  const user = await telegraf.telegram.getMe()
  Object.assign(botInfo, user)
  loadModules()
  return telegraf.handleUpdate(body, res)
}
