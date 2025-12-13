"use client";
import Sidebar from "@/components/shared/sidebar";
// import Navbar from "@/components/shared/navbar";
import { useState } from "react";
import InputPrompt from "@/components/chatbot/prompt/input-prompt";
import Navbar from "@/components/shared/navbar";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";

export default function ChatbotPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  const { canView, loading: permissionsLoading } = usePagePermissions();

  // Check view permission
  if (permissionsLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-200 dark:bg-gray-900 dark:text-gray-200">
        <Sidebar />
        <div className="flex-1 flex flex-col relative w-full">
          <div className="w-full sticky top-0 z-50">
            <Navbar
              setCustomerRisk={setCustomerRisk}
              customerRisk={customerRisk}
              showRiskDropdown={false}
            />
          </div>
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-200 dark:bg-gray-900 dark:text-gray-200">
        <Sidebar />
        <div className="flex-1 flex flex-col relative w-full">
          <div className="w-full sticky top-0 z-50">
            <Navbar
              setCustomerRisk={setCustomerRisk}
              customerRisk={customerRisk}
              showRiskDropdown={false}
            />
          </div>
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Akses Ditolak
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Anda tidak memiliki izin untuk melihat halaman ini. Silakan hubungi administrator Anda jika Anda memerlukan akses.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white text-gray-200 dark:bg-gray-900 dark:text-gray-200">
      {/* SIDEBAR - hidden on mobile, shown on md screens and up */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* NAVBAR - always visible */}
        <div className="w-full sticky top-0 z-50">
          <Navbar
            setCustomerRisk={setCustomerRisk}
            customerRisk={customerRisk}
            showRiskDropdown={false}
          />
        </div>

        {/* CHATBOT CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <InputPrompt />
        </div>
      </div>
    </div>
  );
}
