import {
  AuthPayload,
  AuthPayloadSchema,
} from "@/auth-context/domain/AuthPayload.valueObject";
import { AuthToken } from "@/auth-context/domain/AuthToken.valueObject";
import { IAuthTokenService } from "@/auth-context/domain/interfaces/IAuthTokenService";
import { UserId } from "@/auth-context/domain/UserId.valueObject";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

export class JwtAuthTokenService implements IAuthTokenService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor(jwtSecret: string, jwtExpiresIn = "1h") {
    this.jwtSecret = jwtSecret;
    this.jwtExpiresIn = jwtExpiresIn;
  }

  async generateToken(
    subjectId: UserId,
    payload: AuthPayload,
  ): Promise<AuthToken> {
    const jwtPayload: JWTPayload = {
      ...payload,
    };
    const tokenValue = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(subjectId.id())
      .setIssuedAt()
      .setExpirationTime(this.jwtExpiresIn)
      .sign(new TextEncoder().encode(this.jwtSecret));

    return new AuthToken(tokenValue);
  }

  async verifyToken(token: AuthToken): Promise<AuthPayload | null> {
    try {
      const encodedSecret = new TextEncoder().encode(this.jwtSecret);
      const { payload } = await jwtVerify(token.value, encodedSecret);
      const validationResult = AuthPayloadSchema.safeParse(payload);
      if (!validationResult.success) {
        // console.error("Invalid token payload", validationResult.error);
        return null;
      }
      return validationResult.data;
    } catch (error) {
      if (error instanceof Error) {
        // console.error("Token verification failed:", error.message);
        return null;
      }
      // console.error("Token verification failed for unknown reason");
      return null;
    }
  }
}
