import { AuthPayload } from "../AuthPayload.valueObject";
import { User } from "../User.entity";

export class AuthPayloadFactory {
  constructor() {}
  // Potential use of roles in the future
  // constructor(private readonly roleRepository: IRoleRepository) {}

  async createPayload(user: User): Promise<AuthPayload> {
    const { id: userId, email: userEmail } = user.toAuthPayload();
    return {
      userId,
      userEmail,
    };
  }
}
