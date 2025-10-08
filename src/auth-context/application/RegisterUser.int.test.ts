import { getPrismaTestClient } from "@/../test/setupIntegration";
import { beforeAll, describe, expect, test } from "vitest";
import { PrismaClient } from "../../../generated/prisma";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { RegisterUserUseCase } from "./RegisterUser.usecase";
import { EmailAlreadyExistsError } from "./errors/EmailAlreadyExistsError";

describe("RegisterUserUseCase integration tests", () => {
  let prisma: PrismaClient;
  let userRepository: PrismaUserRepository;
  let registerUserUseCase: RegisterUserUseCase;

  beforeAll(() => {
    prisma = getPrismaTestClient();
    userRepository = new PrismaUserRepository(prisma);
    registerUserUseCase = new RegisterUserUseCase(userRepository);
  });

  test("should register a new user successfully with valid data", async () => {
    // Arrange
    const command = {
      email: "test@example.com",
      clearPassword: "password123",
    };

    // Act
    const user = await registerUserUseCase.execute(command);

    // Assert
    expect(user).toBeDefined();
    expect(user.toPrimitives().email).toBe(command.email);

    // Verify that the user was actually saved in the database
    const savedUser = await prisma.authUser.findUnique({
      where: { id: user.id.id() },
    });
    expect(savedUser).not.toBeNull();
    expect(savedUser?.email).toBe(command.email);
  });

  test("should throw EmailAlreadyExistsError if the email is already in use", async () => {
    // Arrange
    // 1. Create a user first
    const initialCommand = {
      email: "taken@example.com",
      clearPassword: "password123",
    };
    await registerUserUseCase.execute(initialCommand);

    // 2. Prepare a command with the same email
    const conflictingCommand = {
      email: "taken@example.com",
      clearPassword: "anotherPassword456",
    };

    // Act & Assert
    await expect(
      registerUserUseCase.execute(conflictingCommand),
    ).rejects.toThrow(EmailAlreadyExistsError);
  });

  test("should throw an error for invalid password (too short)", async () => {
    // Arrange
    const command = { email: "test@example.com", clearPassword: "123" };

    // Act & Assert
    await expect(registerUserUseCase.execute(command)).rejects.toThrow(
      "Invalid command",
    );
  });

  test("should throw an error for invalid email format", async () => {
    // Arrange
    const command = { email: "not-an-email", clearPassword: "password123" };

    // Act & Assert
    await expect(registerUserUseCase.execute(command)).rejects.toThrow(
      "Invalid command",
    );
  });
});
