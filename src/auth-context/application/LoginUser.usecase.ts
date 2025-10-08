import z from "zod";
import { IUserRepository } from "../domain/interfaces/IUserRepository";
import { IAuthTokenService } from "../domain/interfaces/IAuthTokenService";
import { Email } from "../domain/Email.valueObject";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { AuthPayloadFactory } from "../domain/services/AuthPayloadFactory";

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
    private readonly authPayloadFactory: AuthPayloadFactory,
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

    const payload = await this.authPayloadFactory.createPayload(user);
    const token = await this.authTokenService.generateToken(user.id, payload);
    return { user, token };
  }
}
