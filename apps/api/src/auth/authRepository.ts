import { Prisma, User, prisma } from "@repo/database";
import { ValidationError } from "../shared/errors";

export interface AuthRepository {
  createUser(username: string, password: string): Promise<User>;
  findUserByUsername(username: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
}

export class PrismaAuthRepository implements AuthRepository {
  async createUser(username: string, password: string): Promise<User> {
    try {
      return await prisma.user.create({
        data: {
          username,
          password,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ValidationError("user_already_exists");
        }
      }
      throw e;
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
