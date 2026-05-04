import { prisma } from "../lib/prisma.js"; 
import type{ User } from "@prisma/client";
import  type { CreateUserDTO }   from "../dto/UserDTO.js";


type UpdateUserDTO = Partial<CreateUserDTO>;

export  class UserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

