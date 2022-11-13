import { PrismaClient } from "@prisma/client"

declare global {
  var __db__: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient()
  }
  prisma = global.__db__
  prisma.$connect()
}

export const db = prisma
