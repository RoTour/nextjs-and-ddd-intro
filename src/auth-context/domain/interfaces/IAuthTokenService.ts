import { AuthPayload } from "../AuthPayload.valueObject";
import { AuthToken } from "../AuthToken.valueObject";
import { UserId } from "../UserId.valueObject";

export interface IAuthTokenService {
  generateToken(subjectId: UserId, payload: AuthPayload): Promise<AuthToken>;
  verifyToken(token: AuthToken): Promise<AuthPayload | null>;
}
