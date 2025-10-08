// src/auth-context/application/LoginUser.int.test.ts

import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { getPrismaTestClient } from "@/../test/setupIntegration";
import { PrismaClient } from "../../../generated/prisma";

// Import all real implementations
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { JwtAuthTokenService } from "../infrastructure/services/JwtAuthTokenService";
import { AuthPayloadFactory } from "../domain/services/AuthPayloadFactory";
import { RegisterUserUseCase } from "./RegisterUser.usecase";
import { LoginUserUseCase } from "./LoginUser.usecase";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { User } from "../domain/User.entity";
import { AuthToken } from "../domain/AuthToken.valueObject";
import { Email } from "../domain/Email.valueObject";

describe("LoginUserUseCase integration tests", () => {
  let prisma: PrismaClient;
  let userRepository: PrismaUserRepository;
  let authTokenService: JwtAuthTokenService;
  let authPayloadFactory: AuthPayloadFactory;
  let registerUserUseCase: RegisterUserUseCase;
  let loginUserUseCase: LoginUserUseCase;

  // Test data
  const TEST_USER_EMAIL = "login-test@example.com";
  const TEST_USER_PASSWORD = "password123";

  beforeEach(async () => {
    // 1. Set up all dependencies
    prisma = getPrismaTestClient();
    userRepository = new PrismaUserRepository(prisma);
    authTokenService = new JwtAuthTokenService("test-secret");
    authPayloadFactory = new AuthPayloadFactory();
    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      authTokenService,
      authPayloadFactory,
    );

    // 2. Use RegisterUserUseCase to seed the database for our tests
    registerUserUseCase = new RegisterUserUseCase(userRepository);
    await registerUserUseCase.execute({
      email: TEST_USER_EMAIL,
      clearPassword: TEST_USER_PASSWORD,
    });
  });

  test("should return a user and token for valid credentials", async () => {
    // Arrange
    const command = {
      email: TEST_USER_EMAIL,
      clearPassword: TEST_USER_PASSWORD,
    };

    // Act
    const result = await loginUserUseCase.execute(command);

    // Assert
    expect(result).toBeDefined();
    expect(result.user).toBeInstanceOf(User);
    expect(result.token).toBeInstanceOf(AuthToken);
    expect(result.user.email.value).toBe(TEST_USER_EMAIL);
  });

  test("should throw InvalidCredentialsError for a wrong password", async () => {
    // Arrange
    const command = {
      email: TEST_USER_EMAIL,
      clearPassword: "wrong-password",
    };

    // Act & Assert
    await expect(loginUserUseCase.execute(command)).rejects.toThrow(
      InvalidCredentialsError,
    );
  });

  test("should throw InvalidCredentialsError for a non-existent email", async () => {
    // Arrange
    const command = {
      email: "not-a-user@example.com",
      clearPassword: "any-password",
    };

    // Act & Assert
    await expect(loginUserUseCase.execute(command)).rejects.toThrow(
      InvalidCredentialsError,
    );
  });
});
