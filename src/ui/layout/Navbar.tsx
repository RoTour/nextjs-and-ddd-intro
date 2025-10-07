import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex bg-purple-900 items-center px-8 py-2 h-16 mb-2 [&>a]:hover:underline">
      <Link href={"/auth/register"}>Classic Auth (JWT)</Link>
    </nav>
  );
};

export default Navbar;
