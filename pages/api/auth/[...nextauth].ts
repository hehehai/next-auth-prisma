import { NextApiHandler } from "next"
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
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
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM,
    }),
  ]
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions)

export default authHandler
