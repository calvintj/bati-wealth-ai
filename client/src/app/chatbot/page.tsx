"use client";
import Sidebar from "@/components/shared/sidebar";
// import Navbar from "@/components/shared/navbar";
import { useState } from "react";
import InputPrompt from "@/app/chatbot/_components/prompt/input-prompt";
import Navbar from "@/components/shared/navbar";

export default function ChatbotPage() {
  const [customerRisk, setCustomerRisk] = useState<string>("All");
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative">
        {/* NAVBAR */}
        <Navbar
          setCustomerRisk={setCustomerRisk}
          customerRisk={customerRisk}
        />
        {/* DASHBOARD CONTENT */}
        {/* <main> */}
        <InputPrompt />
        {/* </main> */}
      </div>
    </div>
  );
}
