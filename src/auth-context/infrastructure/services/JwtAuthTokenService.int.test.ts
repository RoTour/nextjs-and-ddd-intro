// src/auth-context/infrastructure/services/JwtAuthTokenService.int.test.ts

import { describe, test, expect, beforeEach, vi } from "vitest";
import { JwtAuthTokenService } from "./JwtAuthTokenService";
import { AuthPayload } from "@/auth-context/domain/AuthPayload.valueObject";
import { UserId } from "@/auth-context/domain/UserId.valueObject";
import { AuthToken } from "@/auth-context/domain/AuthToken.valueObject";
import { SignJWT } from "jose";

describe("JwtAuthTokenService integration tests", () => {
  const TEST_SECRET = "a-very-strong-and-secret-key-for-testing";
  let service: JwtAuthTokenService;

  beforeEach(() => {
    // Re-create the service before each test to ensure isolation
    service = new JwtAuthTokenService(TEST_SECRET, "1h");
  });

  test("should generate a valid token and verify it successfully", async () => {
    // Arrange
    const subjectId = new UserId();
    const payload = new AuthPayload("test@example.com", subjectId.id());

    // Act
    const authToken = await service.generateToken(subjectId, payload);
    const verifiedPayload = await service.verifyToken(authToken);

    // Assert
    expect(authToken).toBeInstanceOf(AuthToken);
    expect(verifiedPayload).not.toBeNull();
    // Note: The verified payload is a plain object from Zod, not an AuthPayload instance.
    expect(verifiedPayload?.userEmail).toBe(payload.userEmail);
    expect(verifiedPayload?.userId).toBe(payload.userId);
  });

  test("should return null for a token signed with a different secret", async () => {
    // Arrange
    const subjectId = new UserId();
    const payload = new AuthPayload("test@example.com", subjectId.id());
    const otherService = new JwtAuthTokenService("a-different-secret");
    const authToken = await otherService.generateToken(subjectId, payload);

    // Act
    const verifiedPayload = await service.verifyToken(authToken);

    // Assert
    expect(verifiedPayload).toBeNull();
  });

  test("should return null for an expired token", async () => {
    // Arrange
    vi.useFakeTimers();
    const expiringService = new JwtAuthTokenService(TEST_SECRET, "1s");
    const subjectId = new UserId();
    const payload = new AuthPayload("test@example.com", subjectId.id());

    // Act
    const authToken = await expiringService.generateToken(subjectId, payload);

    // Advance time by 2 seconds, which is more than the token's 1s validity
    vi.advanceTimersByTime(2000);

    const verifiedPayload = await service.verifyToken(authToken);

    // Assert
    expect(verifiedPayload).toBeNull();

    // Cleanup
    vi.useRealTimers();
  });

  test("should return null for a malformed token", async () => {
    // Arrange
    const malformedToken = new AuthToken("this-is-not-a-valid-jwt");

    // Act
    const verifiedPayload = await service.verifyToken(malformedToken);

    // Assert
    expect(verifiedPayload).toBeNull();
  });

  test("should return null for a token with an invalid payload shape", async () => {
    // Arrange
    // Manually create a token with a bad payload that will fail Zod parsing
    const badPayload = { userEmail: "test@example.com" }; // Missing userId
    const subjectId = new UserId();

    const malformedPayloadTokenString = await new SignJWT(badPayload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(subjectId.id())
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(TEST_SECRET));

    const authToken = new AuthToken(malformedPayloadTokenString);

    // Act
    const verifiedPayload = await service.verifyToken(authToken);

    // Assert
    expect(verifiedPayload).toBeNull();
  });
});
