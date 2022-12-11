import { NextApiHandler } from "next"
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth/next'
import { db } from "~/lib/db/prisma";
import { comparePassword } from "~/lib/utils"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.SECRET,
  session: {
    // Set to jwt in order to CredentialsProvider works properly
    strategy: 'jwt'
  },
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
    CredentialsProvider({
      id: "emailPassword",
      name: 'Password',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: 'Password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials
          if (!email || !password) {
            throw new Error('email and password are required')
          }
          const user = await db.user.findUnique({
            where: { email }
          })
          if (!user) {
            throw new Error('Incorrect email or password')
          }
          if (!user.password) {
            throw new Error('Account not init password, Please use email verification')
          }
          if (!comparePassword(password, user.password)) {
            throw new Error('Incorrect email or password')
          }


          return {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        } catch (err) {
          console.log(err?.message)

          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      const user = await db.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        session.user.noPwd = !user.password
      }
      
      return session
    },
  }
}

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions)

export default authHandler
