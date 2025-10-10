"use server";
import { auth } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

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

  try {
    // This one line replaces the use case and the manual token creation
    await auth.api.signUpEmail({
      body: {
        name: parsedData.data.userEmail.split("@")[0],
        email: parsedData.data.userEmail,
        password: parsedData.data.userPassword,
      },
      asResponse: true,
    });
    console.log("User registered successfully");
  } catch (error) {
    // Handle potential errors, e.g., email already exists
    let message = "Registration failed.";
    if (error instanceof Error && error.message.includes("unique constraint")) {
      message = "This email is already in use.";
    } else if (error instanceof Error) {
      message = error.message;
    }
    return { message };
  }

  // On success, signUpEmail also logs the user in.
  // Just redirect.
  redirect("/");
};

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

  try {
    // This one line replaces the entire use case execution
    await auth.api.signInEmail({
      body: {
        email: parsedData.data.email,
        password: parsedData.data.password,
      },
      asResponse: true,
    });
    console.log("User logged in successfully");
  } catch (error) {
    // better-auth throws an error on failure
    let message = "Login failed. Please check your credentials.";
    if (error instanceof Error) {
      // You can customize messages based on the error
      message = error.message;
    }
    return { success: false, message };
  }

  // On success, better-auth handles the cookie for you.
  // Just redirect.
  redirect("/");
};

export const logoutAction = async () => {
  // Delete the cookie
  (await cookies()).delete("pixelwar_auth_token");
  await auth.api.signOut({
    headers: await headers(),
  });
  // Redirect to the login page
  redirect("/better-auth/login");
};
