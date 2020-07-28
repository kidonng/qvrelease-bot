import { NowRequest, NowResponse } from '@vercel/node'
import { telegraf } from '../src'

export default ({ body }: NowRequest, res: NowResponse) => {
  if (!body) return res.send('It works!')
  return telegraf.handleUpdate(body, res)
}
