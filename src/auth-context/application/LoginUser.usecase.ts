import z from "zod";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { IAuthTokenService } from "../domain/interfaces/IAuthTokenService";
import { Email } from "../domain/Email.valueObject";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";

const LoginUserCommand = z.object({
  email: z.email(),
  clearPassword: z
    .string()
    .min(6, { message: "Password should be at least 6 characters" }),
});
type LoginUserCommand = z.infer<typeof LoginUserCommand>;

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authTokenService: IAuthTokenService,
  ) {}

  async execute(command: LoginUserCommand) {
    const user = await this.userRepository.findByEmail(
      new Email(command.email),
    );
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await user.checkPassword(command.clearPassword);

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = this.authTokenService.generateToken(user);
    return { user, token };
  }
}
