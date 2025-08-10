import {  PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();
  

export class UserRepository {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email} });
  }

  async save(user: {id: string, name: string, email: string, password: string}) {
    return await prisma.user.create({data: user})
  }
}