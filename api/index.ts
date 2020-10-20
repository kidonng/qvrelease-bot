import { NowRequest, NowResponse } from '@vercel/node'
import { telegraf, register } from '../src'
import { handlers, botInfo } from '../src/utils'

export default async ({ body }: NowRequest, res: NowResponse) => {
  handlers.response = res

  const user = await telegraf.telegram.getMe()
  Object.assign(botInfo, user)
  register()
  return telegraf.handleUpdate(body, res)
}
