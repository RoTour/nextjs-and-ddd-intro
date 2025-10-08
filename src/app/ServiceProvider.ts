import { AuthPayloadFactory } from "@/auth-context/domain/services/AuthPayloadFactory";
import { PrismaUserRepository } from "@/auth-context/infrastructure/repositories/PrismaUserRepository";
import { JwtAuthTokenService } from "@/auth-context/infrastructure/services/JwtAuthTokenService";
import { prisma } from "@/shared-kernel/prisma";

export const ServiceProvider = {
  prisma: prisma,
  userRepository: new PrismaUserRepository(prisma),
  authTokenService: new JwtAuthTokenService(
    process.env.JWT_SECRET || "default",
  ),
  authPayloadFactory: new AuthPayloadFactory(),
};
