import { ApplicationError } from "@/shared-kernel/errors/ApplicationError";

export class EmailAlreadyExistsError extends ApplicationError {
  constructor(email: string) {
    super(`The email "${email}" is already registered.`);
    this.name = "EmailAlreadyExistsError";
  }
}
