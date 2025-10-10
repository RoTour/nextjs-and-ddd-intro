// src/ui/layout/Navbar.tsx

import Link from "next/link";
import { cookies, headers } from "next/headers";
import { logoutAction } from "@/app/auth/AuthServerActions.adapter";
import { auth } from "@/lib/auth";

const Navbar = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("pixelwar_auth_token");
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <nav className="flex bg-purple-900 items-center px-8 py-2 h-16 mb-2 text-white">
      <Link href="/" className="font-bold text-lg">
        Rotour&apos;s PixelWar
      </Link>

      <div className="ml-auto flex items-center gap-6">
        {token || !!session ? (
          // If the token exists, the user is logged in.
          // Render the Logout button.
          <form action={logoutAction}>
            <button type="submit" className="hover:underline">
              Logout
            </button>
          </form>
        ) : (
          // If the token does not exist, the user is logged out.
          // Render the Login and Register links.
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
