import type { Gain, Prisma } from "@prisma/client";
import type { CreateGainDTO, UpdateGainDTO } from "../dto/GainDTO.js";
import { prisma } from "../lib/prisma.js";

const removeUndefined = <T extends Record<string, unknown>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>;

export class GainRepository {
  async create(userId: number, data: CreateGainDTO): Promise<Gain> {
    const createData = {
      ...data,
      userId,
    } as Prisma.GainUncheckedCreateInput;

    return prisma.gain.create({
      data: createData,
    });
  }

  async findAll(userId: number): Promise<Gain[]> {
    return prisma.gain.findMany({
      where: { userId },
    });
  }

  async findById(userId: number, id: number): Promise<Gain | null> {
    const gain = await prisma.gain.findUnique({
      where: { id },
    });

    if (!gain || gain.userId !== userId) {
      return null;
    }

    return gain;
  }

  async update(userId: number, id: number, data: UpdateGainDTO): Promise<Gain> {
    const gain = await this.findById(userId, id);

    if (!gain) {
      throw new Error("Registro não encontrado ou indisponível");
    }

    const updateData = removeUndefined(data) as Prisma.GainUncheckedUpdateInput;

    return prisma.gain.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(userId: number, id: number): Promise<Gain> {
    const gain = await this.findById(userId, id);

    if (!gain) {
      throw new Error("Registro não encontrado ou indisponível");
    }

    return prisma.gain.delete({
      where: { id },
    });
  }
}
