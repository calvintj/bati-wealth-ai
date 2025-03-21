import { useEffect } from "react";
import { useRouter } from "next/router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [router]);

  // Add loading state if needed
  if (router.pathname !== "/login" && !localStorage.getItem("user")) {
    return null; // or loading spinner
  }

  return <>{children}</>;
};
