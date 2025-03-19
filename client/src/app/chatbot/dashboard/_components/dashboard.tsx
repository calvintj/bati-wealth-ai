"use client";

import React, { useEffect } from "react";

import { useSessionStore } from "@/stores/use-session-store";

interface DashboardProps {
  theme: "light" | "dark";
}

export default function Dashboard({ theme }: DashboardProps) {
  const sessionId = useSessionStore((state) => state.id);

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

  return (
    <div className="relative flex flex-col gap-4 w-full items-center justify-center mx-auto">
      {/* @ts-expect-error this is works */}
      <tableau-viz
        id="tableau-viz"
        frameborder="none"
        src={
          theme === "dark"
            ? "https://prod-apnortheast-a.online.tableau.com/t/batiwealth/views/BatiWealthDashboardDark/NEW_BatiOverview"
            : "https://prod-apnortheast-a.online.tableau.com/t/batiwealth/views/BatiWealthDashboardLight/NEW_BatiOverview"
        }
        className="w-screen"
        width="100%"
        style={{
          maxWidth: 1440,
          height: "calc(100vh - 263px)",
          backgroundColor: theme === "dark" ? "#161B21" : "#FFFFFF",
        }}
        iframe-attr-style={
          theme === "dark"
            ? "background-color: #161B21;"
            : "background-color: #FFFFFF;"
        }
        height="100%"
        hide-tabs
        toolbar="bottom"
      >
        {/* @ts-expect-error this is also works */}
        <viz-filter field="Assigned RM1" value={sessionId}></viz-filter>

        {/* @ts-expect-error this is also works */}
      </tableau-viz>
    </div>
  );
}
