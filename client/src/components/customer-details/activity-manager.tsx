import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CiCirclePlus } from "react-icons/ci";
import {
  useGetActivity,
  usePostActivity,
} from "../../hooks/customer-details/use-activity-manager";
import { Activity } from "@/types/page/customer-details";

const ActivityManager = ({ customerID }: { customerID: string }) => {
  const {
    data: activityFromHook,
    error,
    isLoading: loading,
    refetch,
  } = useGetActivity(customerID);
  const { mutate: postData } = usePostActivity();

  // Initialize with empty array
  const [localActivity, setLocalActivity] = useState<Activity[]>([]);

  useEffect(() => {
    if (activityFromHook?.data) {
      setLocalActivity(activityFromHook.data);
    }
  }, [activityFromHook]);

  // Popup state and positioning.
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Form fields for adding a new activity.
  const [newActivity, setNewActivity] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const [newDate, setNewDate] = useState(today);

  // Toggle the popup position at the bottom left of the button.
  const togglePopup = () => {
    if (!showPopup && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        // Adjust offset as needed (240px here is based on popup width)
        left: rect.left + window.scrollX - 240,
      });
    }
    setShowPopup((prev) => !prev);
  };

  const addActivity = async () => {
    if (!newActivity.trim() || !newDescription.trim() || !newDate.trim())
      return;

    const newActivityObj = {
      bp_number_wm_core: customerID,
      title: newActivity,
      description: newDescription,
      date: newDate,
    } as Activity;

    try {
      postData(newActivityObj, {
        onSuccess: () => {
          refetch();
          setNewActivity("");
          setNewDescription("");
          setNewDate("");
          setShowPopup(false);
        },
      });
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  return (
    <div className="relative p-4 rounded-lg text-white w-full bg-[#1D283A]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Aktivitas</h2>
        <button
          ref={buttonRef}
          onClick={togglePopup}
          className="text-2xl hover:text-gray-300 cursor-pointer"
        >
          <CiCirclePlus />
        </button>
      </div>

      {/* Activity List */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : localActivity.length === 0 ? (
        <p className="text-center bg-gray-700 p-4 rounded-2xl">
          Tidak ada aktivitas tersedia !
        </p>
      ) : (
        <ul className="mb-4 max-h-80 overflow-y-auto rounded-md">
          {localActivity.map((activity, index) => (
            <li
              key={index}
              className="bg-gray-700 p-4 mb-2 rounded-md hover:bg-gray-600 transition-colors flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{activity.title}</h3>
                <p className="text-sm text-gray-300">{activity.description}</p>
              </div>
              <p className="text-xs text-gray-400">{activity.date.split('T')[0]}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Add Activity Popup */}
      {showPopup &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
            className="bg-gray-800 p-4 rounded-lg shadow-lg w-60 border border-gray-600"
          >
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              placeholder="Aktivitas"
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Deskripsi"
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="w-1/2 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={addActivity}
                className="w-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Tambahkan
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActivityManager;
