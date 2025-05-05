import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      const callback = router.query.callbackUrl || "/";
      router.replace(callback as string);
    }
  }, [status]);

  const handleLogin = () => {
    signIn("credentials", {
      email,
      password,
      callbackUrl: (router.query.callbackUrl as string) || "/",
    });
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-4 -mt-20">
        <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-300">
          <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-4 animate-fade-in">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6 animate-fade-in delay-200">
            Enter your credentials to access your account
          </p>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 hover:shadow-lg duration-300"
          >
            Login
          </button>

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Don’t have an account?</span>
            <a href="/signup" className="text-blue-700 font-medium hover:underline ml-1 text-sm">Sign up</a>
          </div>
        </div>
      </main>


    </>
  );
}