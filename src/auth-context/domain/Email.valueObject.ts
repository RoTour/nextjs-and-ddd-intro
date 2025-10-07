import z from "zod";

export class Email {
  private readonly email: string;

  get value() {
    return this.email;
  }

  constructor(email: string) {
    const safeEmail = z.email().parse(email);
    this.email = safeEmail;
  }
}
