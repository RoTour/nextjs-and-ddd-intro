"use client";

import { useActionState } from "react";
import { AuthServerActionLogin } from "../AuthServerActions.adapter";
import Link from "next/link";

const LoginPage = () => {
  const [state, action] = useActionState(AuthServerActionLogin, undefined);
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
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
          {state?.errors?.properties?.email?.errors && (
            <p className="text-red-500">
              {state.errors.properties.email.errors.join(", ")}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
          {state?.errors?.properties?.password?.errors && (
            <p className="text-red-500">
              {state.errors.properties.password.errors.join(", ")}
            </p>
          )}
        </div>
        {state?.message && <p className="text-red-500">{state.message}</p>}
        <button
          type="submit"
          className="mt-8 bg-purple-900 rounded-md px-8 py-2"
        >
          Login
        </button>
        <Link
          href="/auth/register"
          className="text-purple-700 underline text-center"
        >
          No account ? Register instead
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
