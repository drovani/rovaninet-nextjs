import { NextApiRequest, NextApiResponse } from "next"

const Hello = (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ name: 'John Doe' })
}

export default Hello