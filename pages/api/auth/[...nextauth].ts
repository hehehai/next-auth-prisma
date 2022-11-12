import { NextApiHandler } from "next"
import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import NextAuth from 'next-auth/next'

const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ]
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions)

export default authHandler
