import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const validatePassword = (password) => {
    const minLength = password.length >= 7;
    const hasCapital = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasCapital && hasSpecialChar;
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 7 characters long, include 1 capital letter, and 1 special character.");
      return;
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Signup successful!");
      router.push("/login");
    } else {
      alert("Signup failed.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-green-200 px-4 -mt-20">
        <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl transform transition-all duration-500 hover:-translate-y-1 hover:shadow-green-300">
          <h2 className="text-4xl font-extrabold text-center text-green-800 mb-4 animate-fade-in">
            Create an Account
          </h2>
          <p className="text-center text-gray-600 mb-6 animate-fade-in delay-200">
            Sign up to get started with your journey
          </p>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />

          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            type="password"
            className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5 hover:shadow-lg duration-300"
          >
            Sign Up
          </button>

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Already have an account?</span>
            <a href="/login" className="text-green-700 font-medium hover:underline ml-1 text-sm">Log in</a>
          </div>
        </div>
      </main>

    </>
  );
}
