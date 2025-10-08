import z from "zod";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { Email } from "../domain/Email.valueObject";
import { EmailAlreadyExistsError } from "./errors/EmailAlreadyExistsError";
import { User } from "../domain/User.entity";

const RegisterUserCommand = z.object({
  email: z.email(),
  clearPassword: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
});

export type RegisterUserCommand = z.infer<typeof RegisterUserCommand>;

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(command: RegisterUserCommand) {
    const validationResult = RegisterUserCommand.safeParse(command);
    if (!validationResult.success) {
      throw new Error("Invalid command");
    }

    const { email, clearPassword } = validationResult.data;

    const existingUser = await this.userRepository.findByEmail(
      new Email(email),
    );
    if (existingUser) {
      throw new EmailAlreadyExistsError("Email already in use");
    }
    const user = await User.create(email, clearPassword);
    await this.userRepository.save(user);
    return user;
  }
}
