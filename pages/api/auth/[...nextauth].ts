import { NextApiHandler } from "next"
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from "next-auth/providers/github"
import NextAuth from 'next-auth/next'
import { db } from "~/lib/db/prisma";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ]
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions)

export default authHandler
