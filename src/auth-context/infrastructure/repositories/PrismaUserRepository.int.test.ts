import { describe, test, beforeAll, expect, beforeEach } from "vitest";
import { PrismaClient } from "../../../../generated/prisma";
import { getPrismaTestClient } from "@/../test/setupIntegration";
import { PrismaUserRepository } from "@/auth-context/infrastructure/repositories/PrismaUserRepository";
import { User } from "@/auth-context/domain/User.entity";
import { UserId } from "@/auth-context/domain/UserId.valueObject";
import { Email } from "@/auth-context/domain/Email.valueObject";
import { Password } from "@/auth-context/domain/Password.valueObject";

describe("PrismaUserRepository integration tests", () => {
  let prisma: PrismaClient;
  let repository: PrismaUserRepository;

  beforeAll(() => {
    prisma = getPrismaTestClient();
    repository = new PrismaUserRepository(prisma);
  });

  beforeEach(async () => {
    await prisma.authUser.deleteMany();
  });

  test("should save a new user and find them by ID", async () => {
    // Arrange
    const user = await User.create("test@example.com", "password123");

    // Act
    await repository.save(user);
    const foundUser = await repository.findById(user.id);

    // Assert
    expect(foundUser).not.toBeNull();
    expect(foundUser?.id.equals(user.id)).toBe(true);
    expect(foundUser?.toPrimitives().email).toBe("test@example.com");
  });

  test("should find a user by email", async () => {
    // Arrange
    const user = await User.create("findme@example.com", "password123");
    await repository.save(user);

    // Act
    const foundUser = await repository.findByEmail(
      new Email("findme@example.com"),
    );

    // Assert
    expect(foundUser).not.toBeNull();
    expect(foundUser?.id.equals(user.id)).toBe(true);
  });

  test("should return null if user is not found by id", async () => {
    // Arrange
    const nonExistentId = new UserId();

    // Act
    const foundUser = await repository.findById(nonExistentId);

    // Assert
    expect(foundUser).toBeNull();
  });

  test("should return null if user is not found by email", async () => {
    // Arrange
    const nonExistentEmail = new Email("dontexist@example.com");

    // Act
    const foundUser = await repository.findByEmail(nonExistentEmail);

    // Assert
    expect(foundUser).toBeNull();
  });

  test("should update an existing user (upsert)", async () => {
    // Arrange
    const user = await User.create("update@example.com", "password123");
    await repository.save(user);

    // Create a new password object to simulate a change
    const newPassword = Password.fromClear("newStrongerPassword");
    const updatedUser = User.reconstitute({
      ...user.toPrimitives(),
      hashedPassword: (await newPassword).toPrimitives().hashedPassword,
    });

    // Act
    await repository.save(updatedUser);
    const foundUser = await repository.findById(user.id);
    const isNewPasswordCorrect = await foundUser?.checkPassword(
      "newStrongerPassword",
    );

    // Assert
    expect(foundUser).not.toBeNull();
    expect(isNewPasswordCorrect).toBe(true);
  });
});
