import { ApplicationError } from "@/shared-kernel/errors/ApplicationError";

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super(`Invalid email or password.`);
    this.name = "InvalidCredentialsError";
  }
}
