import { useRouter } from "next/navigation";
import { logger } from "@/utils/logger";
import { useSessionStore } from "@/stores/use-session-store";

export const useLogout = () => {
  const router = useRouter();
  const setSession = useSessionStore((state) => state.setSession);

  const handleLogout = () => {
    // Get user info before clearing
    const userStr = localStorage.getItem("user");
    let userInfo = {};

    if (userStr) {
      try {
        userInfo = JSON.parse(userStr);
      } catch (error) {
        logger.error("Error parsing user data during logout", { error });
      }
    }

    // Clear auth-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear session store
    setSession({
      accessToken: null,
      id: null,
      user: null,
    });

    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Clear any session storage
    sessionStorage.clear();

    // Clear any pending timeouts/intervals
    const timeouts = window.setTimeout(() => {}, 0);
    for (let i = 0; i < timeouts; i++) {
      window.clearTimeout(i);
    }

    const intervals = window.setInterval(() => {}, 0);
    for (let i = 0; i < intervals; i++) {
      window.clearInterval(i);
    }

    logger.info("User logged out", { userInfo });

    // Redirect to login page
    router.push("/");
  };

  return { handleLogout };
};
