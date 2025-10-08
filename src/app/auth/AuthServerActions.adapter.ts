"use server";
import {
  RegisterUserCommand,
  RegisterUserUseCase,
} from "@/auth-context/application/RegisterUser.usecase";
import { z } from "zod";
import { ServiceProvider } from "../ServiceProvider";
import { EmailAlreadyExistsError } from "@/auth-context/application/errors/EmailAlreadyExistsError";
import {
  LoginUserCommand,
  LoginUserUseCase,
} from "@/auth-context/application/LoginUser.usecase";
import { InvalidCredentialsError } from "@/auth-context/application/errors/InvalidCredentialsError";
import { cookies } from "next/headers";

const registerSchema = z.object({
  userEmail: z.email(),
  userPassword: z.string().min(6).trim(),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

type ZodTreeifiedErrors = {
  errors: string[];
  properties?: {
    [key: string]: { errors: string[] } | undefined;
  };
};

export type FormState =
  | {
      errors?: ZodTreeifiedErrors;
      message?: string;
    }
  | undefined;

const registerUserUseCase = new RegisterUserUseCase(
  ServiceProvider.userRepository,
);
export const AuthServerActionRegister = async (
  state: FormState,
  formData: FormData,
) => {
  const formUserEmail = formData.get("userEmail");
  const formUserPassword = formData.get("userPassword");
  const payload = {
    userEmail: formUserEmail,
    userPassword: formUserPassword,
  };

  const parsedData = registerSchema.safeParse(payload);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (!parsedData.success) {
    return { success: false, errors: z.treeifyError(parsedData.error) };
  }

  const command: RegisterUserCommand = {
    clearPassword: parsedData.data.userPassword,
    email: parsedData.data.userEmail,
  };
  try {
    await registerUserUseCase.execute(command);
  } catch (error) {
    let message = "Registration failed";
    if (error instanceof EmailAlreadyExistsError) {
      message = `The email ${command.email} is already in use. Please use a different email.`;
    }
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message };
  }

  return {
    success: true,
    message: "User registered successfully",
  };
};

const loginUserUseCase = new LoginUserUseCase(
  ServiceProvider.userRepository,
  ServiceProvider.authTokenService,
  ServiceProvider.authPayloadFactory,
);
const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
export const AuthServerActionLogin = async (
  state: FormState,
  formData: FormData,
) => {
  const parsedData = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsedData.success) {
    return { success: false, errors: z.treeifyError(parsedData.error) };
  }

  const command: LoginUserCommand = {
    clearPassword: parsedData.data.password,
    email: parsedData.data.email,
  };

  const cookieStore = await cookies();
  try {
    const result = await loginUserUseCase.execute(command);
    cookieStore.set({
      name: "pixelwar_auth_token",
      value: result.token.value,
    });
    return { success: true, message: "Login successful" };
  } catch (error) {
    let message = "Login failed";
    if (error instanceof InvalidCredentialsError) {
      message = "Invalid email or password. Please try again.";
    }
    if (error instanceof Error) {
      message = error.message;
    }
    return { success: false, message };
  }
};
