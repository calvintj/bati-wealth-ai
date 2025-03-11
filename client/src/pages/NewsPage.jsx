import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function OverviewPage() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar />

        {/* DASHBOARD CONTENT */}
        <main className="grid grid-rows-3 gap-2 flex-1 overflow-y-auto mr-2 my-2">
          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-2xl"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
            <div
              className="rounded-2xl"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
            <div
              className="rounded-2xl"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-2xl col-span-2"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
            <div
              className="rounded-2xl"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              className="rounded-2xl col-span-2"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
            <div
              className="rounded-2xl"
              style={{ backgroundColor: "#1D283A" }}
            ></div>
          </div>
        </main>
      </div>
    </div>
  );
}
