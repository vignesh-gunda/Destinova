import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-9xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl ml-10 mr-10 font-bold text-blue-600">
          Destinova
        </Link>
        <div className="flex gap-5 text-sm mr-10 font-medium items-center">
          <Link href="/browse" className="hover:text-blue-600 transition">Browse</Link>
          <Link href="/recommendations" className="hover:text-blue-600 transition">Recommendations</Link>
          <Link href="/favorites" className="hover:text-blue-600 transition">Favorites</Link>

          {!session ? (
            <>
              <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition">Login</Link>
              <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition">Sign Up</Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 text-md">Hi, {session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
