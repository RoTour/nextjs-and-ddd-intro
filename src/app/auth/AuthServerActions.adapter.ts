"use server";
import { z } from "zod";

const registerSchema = z.object({
  userEmail: z.email(),
  userPassword: z.string().min(6).trim(),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export type FormState =
  | {
      errors?: {
        userEmail?: string[];
        userPassword?: string[];
      };
      message?: string;
    }
  | undefined;

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
    return { success: false, errors: parsedData.error.flatten().fieldErrors };
  }
  return {
    success: true,
    message: "User registered successfully",
  };
};
