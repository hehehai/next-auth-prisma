import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { db } from "~/lib/db/prisma"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { title, content } = req.body

  const session = await getSession({ req })

  if (!session?.user) {
    return res.status(403)
  }

  const result = await db.post.create({
    data: {
      title,
      content,
      author: { connect: { email: session.user?.email } }
    }
  })

  res.json(result)
}
