"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  AuthServerActionRegister,
  FormState,
} from "../BetterAuthServerActions.adapter";

const RegisterPage = () => {
  const [state, action] = useActionState<FormState, FormData>(
    AuthServerActionRegister,
    undefined,
  );

  return (
    <div>
      <form
        action={action}
        className="[&_input]:border-purple-300 [&_input]:border-2 [&_input]:rounded-md [&_input]:h-10 [&_input]:px-2 flex flex-col gap-2 px-16 py-8"
      >
        {state?.errors?.errors && state.errors.errors.length > 0 && (
          <p className="text-red-500">{state.errors.errors.join(", ")}</p>
        )}
        <div className="flex flex-col">
          <label htmlFor="userEmail">Email:</label>
          <input type="email" id="userEmail" name="userEmail" required />
          {state?.errors?.properties?.userEmail?.errors && (
            <p className="text-red-500">
              {state.errors.properties.userEmail.errors.join(", ")}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="userPassword">Password:</label>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            required
          />
          {state?.errors?.properties?.userPassword?.errors && (
            <p className="text-red-500">
              {state.errors.properties.userPassword.errors.join(", ")}
            </p>
          )}
        </div>
        {state?.message && <p className="text-red-500">{state.message}</p>}
        <button
          type="submit"
          className="mt-8 bg-purple-900 rounded-md px-8 py-2"
        >
          Register
        </button>
        <Link
          href="/better-auth/login"
          className="text-purple-700 underline text-center"
        >
          Already have an account? Login instead
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
