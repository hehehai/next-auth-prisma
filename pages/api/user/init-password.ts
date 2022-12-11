import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { db } from "~/lib/db/prisma"
import { hashPassword } from "~/lib/utils"
import { authOptions } from "../auth/[...nextauth]"

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { user } = await unstable_getServerSession(req, res, authOptions)
      if (!user) {
        throw new Error('Need Login')
      }
      const { password } = req.body
      if (!password) {
        throw new Error('Invalid Password')
      }

      await db.user.update({
        where: { email: user.email }, data: {
          password: hashPassword(password)
        }
      });

      return res.status(200).end()
    } catch (err) {
      console.log(err.message)

      return res.status(500).end()
    }
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported`)
  }
}
