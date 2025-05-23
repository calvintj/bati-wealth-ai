"use client";

import { useEffect, useState, useCallback } from "react";
import { logger } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        router.push("/dashboard-overview");
      }
    } catch (error) {
      router.push("/");
    }
  }, [router]);

  // Update logs with debouncing
  const updateLogs = useCallback(() => {
    setLogs(logger.getLogs());
  }, []);

  useEffect(() => {
    // Initial load
    updateLogs();

    // Update every 5 seconds instead of every second
    const interval = setInterval(updateLogs, 5000);

    return () => clearInterval(interval);
  }, [updateLogs]);

  const filteredLogs = logs.filter((log) =>
    filter === "all" ? true : log.level === filter
  );

  const getLogColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      case "debug":
        return "text-gray-500";
      default:
        return "text-white";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Application Logs</h1>
        <div className="space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "error" ? "default" : "outline"}
            onClick={() => setFilter("error")}
            className="text-red-500"
          >
            Errors
          </Button>
          <Button
            variant={filter === "warn" ? "default" : "outline"}
            onClick={() => setFilter("warn")}
            className="text-yellow-500"
          >
            Warnings
          </Button>
          <Button
            variant={filter === "info" ? "default" : "outline"}
            onClick={() => setFilter("info")}
            className="text-blue-500"
          >
            Info
          </Button>
          <Button
            variant={filter === "debug" ? "default" : "outline"}
            onClick={() => setFilter("debug")}
            className="text-gray-500"
          >
            Debug
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              logger.clearLogs();
              setLogs([]);
            }}
          >
            Clear Logs
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-gray-900 text-white">
        <div className="space-y-2">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`p-2 rounded ${getLogColor(log.level)}`}
            >
              <div className="flex justify-between">
                <span className="font-bold">[{log.level.toUpperCase()}]</span>
                <span className="text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="mt-1">{log.message}</div>
              {log.data && (
                <pre className="mt-1 text-sm bg-gray-800 p-2 rounded overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No logs to display
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
