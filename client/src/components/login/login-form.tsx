import { FormEvent } from "react";
import Link from "next/link";
import { useLogin } from "@/hooks/login/use-login";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  // Custom hook for login functionality
  const { handleLogin, error, loading } = useLogin();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      await handleLogin(data.email, data.password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* EMAIL INPUT */}
      <div className="mb-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-black block mb-1"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="RM001@batiinvestasi.ai"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full p-3 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* PASSWORD INPUT */}
      <div className="mb-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-black block mb-1"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Rm12345!"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="w-full p-3 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 rounded-md outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
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
