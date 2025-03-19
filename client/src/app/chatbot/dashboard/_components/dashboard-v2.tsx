"use client";

import { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { decodeToken } from "@/lib/decode-token";
import { genDirectTrustToken } from "@/lib/gen-direct-trust-token";
import { useSessionStore } from "@/stores/use-session-store";
import { VizLoadError } from "@/types/viz-load-error";

interface DashboardProps {
  theme: "light" | "dark";
}

export default function DashboardV2({ theme }: DashboardProps) {
  const sessionId = useSessionStore((state) => state.id);
  const sessionToken = useSessionStore((state) => state.accessToken);
  const setSession = useSessionStore((state) => state.setSession);
  const router = useRouter();

  const loadTableauScript = () => {
    const script = document.createElement("script");
    script.src =
      "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js";
    script.type = "module";
    script.async = true;
    script.onload = () => console.log("TableAU Script Loaded");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  };

  useEffect(() => {
    const cleanup = loadTableauScript();
    return cleanup;
  }, []);

  const checkExpiredToken = async () => {
    if (!sessionToken) return null;
    const decoded = await decodeToken(sessionToken);

    if (!decoded || !(decoded as JwtPayload)?.exp) {
      console.error("Invalid or malformed token.");
      return null;
    }

    // Check if the token is expired
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return (decoded as JwtPayload)?.exp ?? 0 > currentTime; // Returns `true` if not expired, `false` if expired
  };

  useEffect(() => {
    try {
      const tableauViz = document.querySelector<tableau.Viz & Element>(
        "tableau-viz"
      );

      if (!sessionToken) return;

      tableauViz?.addEventListener("vizloaderror", async (e) => {
        const ev: VizLoadError = e as unknown as VizLoadError;
        const errorDetails = JSON.parse(ev?.detail?.message);

        // Determine token expired or not from the response
        const isTokenExpiredResponse =
          ev?.detail?.errorCode === "auth-failed" &&
          errorDetails?.statusCode === 401 &&
          errorDetails?.errorMessage?.errors?.[0]?.code === 10084;

        // Determine token really expired or not by programatically
        const isTokenReallyExpired = await checkExpiredToken();

        if (isTokenExpiredResponse || isTokenReallyExpired) {
          const accessToken = await genDirectTrustToken();
          setSession({
            id: sessionId ?? "",
            accessToken,
          });
        }

        console.error("Tableau Viz Error Code:", ev?.detail?.errorCode);
        console.error("Tableau Viz Error Message:", errorDetails);
      });

      console.log("Tableau Viz Loaded");
    } catch (error) {
      console.error("Error initializing Tableau Viz:", error);
      setSession({ accessToken: null, id: null });
      router.push("/login");
    }
  }, []);

  console.log(theme, "Theme");

  return (
    <div className="relative flex flex-col gap-4 w-full items-center justify-center mx-auto">
      <div
        style={{
          width: "100vw",
          maxWidth: 1440,
          height: "calc(100vh - 263px)",
          overflow: "auto",
          backgroundColor: theme === "dark" ? "#161B21" : "#FFFFFF",
        }}
      >
        {/* @ts-expect-error this is works */}
        <tableau-viz
          id="tableau-viz"
          frameborder="none"
          token={sessionToken}
          src={
            theme === "dark"
              ? "https://prod-apnortheast-a.online.tableau.com/t/batiwealth/views/BatiWealthDashboardDark/NEW_BatiOverview"
              : "https://prod-apnortheast-a.online.tableau.com/t/batiwealth/views/BatiWealthDashboardLight/NEW_BatiOverview"
          }
          width="1440px"
          height="1380px"
          hide-tabs
          toolbar="bottom"
        >
          {/* @ts-expect-error this is also works */}
          <viz-filter field="Action (State/Province)" value="America">
            {/* @ts-expect-error this is also works */}
          </viz-filter>

          {/* @ts-expect-error this is also works */}
        </tableau-viz>
      </div>
    </div>
  );
}
