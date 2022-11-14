import { NextApiRequest, NextApiResponse } from "next"
import { db } from "~/lib/db/prisma"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const postId = req.query.id
  const post = await db.post.update({
    where: { id: String(postId) },
    data: { published: true }
  })

  res.json(post)
}
