import { FormEvent, useState } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/login/use-login";

const LoginForm: React.FC = () => {
  // Custom hook for login functionality
  const { handleLogin, error, loading } = useLogin();
  
  // Form state
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* EMAIL INPUT */}
      <div className="mb-2">
        <label htmlFor="email" className="text-sm font-medium text-black block mb-1">
          Email address
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="RM001@batiinvestasi.ai"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md outline-none"
        />
      </div>

      {/* PASSWORD INPUT */}
      <div className="mb-2">
        <label htmlFor="password" className="text-sm font-medium text-black block mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Rm12345!"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md outline-none"
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-md text-center text-sm">
          {error}
        </div>
      )}

      {/* LOGIN BUTTON & FORGOT PASSWORD LINK */}
      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="cursor-pointer py-2 px-4 text-white font-bold rounded-md bg-blue-600 hover:bg-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
