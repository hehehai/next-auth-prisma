import { NextApiRequest, NextApiResponse } from "next"
import { db } from "~/lib/db/prisma"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const postId = req.query.id
    const post = await db.post.delete({ where: { id: String(postId) } })

    res.json(post)
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported`)
  }
}
