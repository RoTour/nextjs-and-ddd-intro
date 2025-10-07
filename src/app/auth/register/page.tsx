"use client";
import {
  AuthServerActionRegister,
  type RegisterSchema,
} from "../AuthServerActions.adapter";
import { useActionState } from "react";

const RegisterPage = () => {
  const [state, action] = useActionState(AuthServerActionRegister, undefined);
  return (
    <>
      <div>{state?.success}</div>

      {/* If errors */}
      {state?.errors && (
        <div className="flex flex-col gap-2">
          {(["userEmail", "userPassword"] as (keyof RegisterSchema)[]).map(
            (field) => (
              <div key={field}>
                {state.errors[field] && (
                  <div>
                    <p>{field}</p>
                    <div className="text-red-500">
                      {state.errors[field].map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      )}

      <form action={action}>
        <input type="email" name="userEmail" placeholder="Username" />
        <input type="password" name="userPassword" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default RegisterPage;
