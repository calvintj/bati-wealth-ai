"use client";
import Sidebar from "@/components/shared/sidebar";
// import Navbar from "@/components/shared/navbar";
import { useState } from "react";
import InputPrompt from "@/app/chatbot/_components/prompt/input-prompt";
import Navbar from "@/components/shared/navbar";

export default function ChatbotPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
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
