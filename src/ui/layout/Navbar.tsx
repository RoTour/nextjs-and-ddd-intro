// src/ui/layout/Navbar.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { logoutAction } from "@/app/auth/AuthServerActions.adapter";

const Navbar = () => {
  // On the server, check if the auth token cookie exists.
  const token = cookies().get("pixelwar_auth_token");

  return (
    <nav className="flex bg-purple-900 items-center px-8 py-2 h-16 mb-2 text-white">
      <Link href="/" className="font-bold text-lg">
        Rotour&apos;s PixelWar
      </Link>

      <div className="ml-auto flex items-center gap-6">
        {token ? (
          // If the user is logged in, show a Logout button.
          // The button is in a form that calls our server action.
          <form action={logoutAction}>
            <button type="submit" className="hover:underline">
              Logout
            </button>
          </form>
        ) : (
          // If the user is logged out, show Login and Register links.
          <>
            <Link href="/auth/login" className="hover:underline">
              Login
            </Link>
            <Link href="/auth/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
