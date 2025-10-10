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
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { unescape } from "querystring";

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
  // --- 1. Data Parsing and Validation ---
  const parsedData = registerSchema.safeParse({
    userEmail: formData.get("userEmail"),
    userPassword: formData.get("userPassword"),
  });

  if (!parsedData.success) {
    return { errors: z.treeifyError(parsedData.error) };
  }

  const command: RegisterUserCommand = {
    email: parsedData.data.userEmail,
    clearPassword: parsedData.data.userPassword,
  };

  // --- 2. Use Case Execution and Error Handling ---
  let newUser;
  try {
    // The register use case returns the new user object
    newUser = await registerUserUseCase.execute(command);
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return { message: "This email is already in use. Please try to login." };
    }
    return { message: "An unexpected error occurred during registration." };
  }

  // --- 3. Success Case: Auto-Login and Redirect ---
  // If we get here, registration was successful.
  try {
    // Use the services directly to create a token for the new user
    const payload =
      await ServiceProvider.authPayloadFactory.createPayload(newUser);
    const token = await ServiceProvider.authTokenService.generateToken(
      newUser.id,
      payload,
    );

    // Set the cookie
    (await cookies()).set("pixelwar_auth_token", token.value, {
      httpOnly: true,
      path: "/",
    });
  } catch (error) {
    // This would only fail if token creation fails, which is unlikely.
    // We can't redirect, so we'll show an error.
    return {
      message:
        "Account created, but failed to log you in. Please try logging in manually.",
    };
  }

  // Redirect to the homepage
  redirect("/");
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
    redirect("/");
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

// In src/app/auth/AuthServerActions.adapter.ts

// ... (at the end of the file)

export const logoutAction = async () => {
  // Delete the cookie
  (await cookies()).delete("pixelwar_auth_token");
  await auth.api.signOut({
    headers: await headers(),
  });
  // Redirect to the login page
  redirect("/better-auth/login");
};
