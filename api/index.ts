import { NowRequest, NowResponse } from '@vercel/node'
import { telegraf } from '../src'
import { request } from '../src/utils'

export default ({ body }: NowRequest, res: NowResponse) => {
  if (!body) return res.send('It works!')
  request.handler = res
  return telegraf.handleUpdate(body, res)
}
