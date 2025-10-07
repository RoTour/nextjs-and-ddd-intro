import {
  Prisma,
  PrismaClient,
  AuthUser as PrismaUser,
} from "../../../../generated/prisma";
import { Email } from "@/auth-context/domain/Email.valueObject";
import { IUserRepository } from "@/auth-context/domain/interfaces/IUserRepository";
import { Password } from "@/auth-context/domain/Password.valueObject";
import { User } from "@/auth-context/domain/User.entity";
import { UserId } from "@/auth-context/domain/UserId.valueObject";

class PrismaUserMapper {
  fromPrismaToDomain(prismaUser: PrismaUser): User {
    const userId = new UserId(prismaUser.id);
    const email = new Email(prismaUser.email);
    const password = Password.fromHashed(prismaUser.hashedPassword);
    return new User(userId, email, password);
  }

  fromDomainToPrisma(user: User): Prisma.AuthUserCreateInput {
    const primitive = user.toPrimitives();
    return {
      id: primitive.id,
      email: primitive.email,
      hashedPassword: primitive.hashedPassword,
    };
  }
}

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly client: PrismaClient) {}
  async findById(id: UserId): Promise<User | null> {
    const user = await this.client.authUser.findUnique({
      where: { id: id.id() },
    });
    return user ? new PrismaUserMapper().fromPrismaToDomain(user) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.client.authUser.findUnique({
      where: { email: email.value },
    });
    return user ? new PrismaUserMapper().fromPrismaToDomain(user) : null;
  }

  async save(user: User): Promise<void> {
    const prismaUser = new PrismaUserMapper().fromDomainToPrisma(user);
    await this.client.authUser.upsert({
      where: { id: prismaUser.id! },
      create: prismaUser,
      update: prismaUser,
    });
  }
}
