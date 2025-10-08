import z from "zod";

export const AuthPayloadSchema = z.object({
  userEmail: z.email(),
  userId: z.string(),
});

export class AuthPayload {
  userEmail: string;
  userId: string;

  constructor(email: string, userId: string) {
    this.userEmail = email;
    this.userId = userId;
  }
}
