import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CiCirclePlus } from "react-icons/ci";
import useGetActivity from "../../hooks/customer-details/use-get-activity"; // Custom hook to fetch tasks
import usePostActivity from "../../hooks/customer-details/use-post-activity"; // Custom hook to post a new task

interface Activity {
  title: string;
  description: string;
  date: string;
}

interface ActivityWithCustomerId extends Activity {
  bp_number_wm_core: string;
}

const ActivityManager = ({ customerID }: { customerID: string }) => {
  // Fetch tasks using the provided customerID (as bp_number_wm_core).
  console.log("customerID", customerID);
  const {
    activity: activityFromHook,
    error,
    loading,
  } = useGetActivity(customerID);
  const { postData, loading: posting } = usePostActivity();

  // Local state for tasks to update immediately without a full refetch.
  const [localActivity, setLocalActivity] = useState<Activity[]>([]);
  useEffect(() => {
    if (activityFromHook) {
      setLocalActivity(activityFromHook);
    }
  }, [activityFromHook]);

  // Popup state and positioning.
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Form fields for adding a new activity.
  const [newActivity, setNewActivity] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");

  // All fetched activities.
  const activities = localActivity;

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

  // Add a new activity and update local state optimistically.
  const addActivity = async () => {
    if (!newActivity.trim() || !newDescription.trim() || !newDate.trim())
      return;
    try {
      // Include customerID as bp_number_wm_core in the payload.
      const newActivityObj = await postData({
        bp_number_wm_core: customerID,
        title: newActivity,
        description: newDescription,
        date: newDate,
      } as ActivityWithCustomerId);
      setLocalActivity((prev) => [...prev, newActivityObj]);
      // Reset form and close popup.
      setNewActivity("");
      setNewDescription("");
      setNewDate("");
      setShowPopup(false);
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  return (
    <div className="relative p-4 rounded-lg text-white w-full bg-[#1D283A]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-xl font-bold">Riwayat Aktivitas</p>
        <button
          ref={buttonRef}
          className="text-3xl text-blue-500 cursor-pointer"
          onClick={togglePopup}
          aria-label="Add Task"
        >
          <CiCirclePlus />
        </button>
      </div>

      {/* Loading or error messages */}
      {loading && (
        <p className="text-center text-2xl h-[220px] flex justify-center items-center">
          N/A
        </p>
      )}
      {error && <p>Error: {error.message}</p>}

      {/* Activity list */}
      {!loading &&
        !error &&
        (activities.length === 0 ? (
          <p className="text-center bg-gray-700 p-4 rounded-2xl">
            Tidak ada aktivitas tersedia !
          </p>
        ) : (
          <ul className="mb-4 max-h-80 overflow-y-auto rounded-md">
            {activities.map((activity, index) => (
              <li
                key={index}
                className="bg-gray-700 py-2 px-4 mt-2 rounded-2xl text-white flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{activity.title}</p>
                  <p>{activity.description}</p>
                </div>
                <p className="text-gray-400">
                  {activity.date
                    ? new Date(activity.date).toLocaleDateString("id-ID")
                    : "—"}
                </p>
              </li>
            ))}
          </ul>
        ))}

      {/* Popup rendered via Portal */}
      {showPopup &&
        createPortal(
          <div
            style={{ top: popupPosition.top, left: popupPosition.left }}
            className="absolute w-60 p-4 bg-[#1D283A] border border-gray-300 rounded-lg shadow-lg z-50"
          >
            <h4 className="text-md font-bold mb-3 text-white">
              Tambahkan aktivitas baru
            </h4>
            <input
              type="text"
              className="p-2 rounded-md text-black bg-white w-full mb-2"
              placeholder="Aktivitas"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
            />
            <input
              type="text"
              className="p-2 rounded-md text-black bg-white w-full mb-2"
              placeholder="Deskripsi"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <input
              type="date"
              className="p-2 rounded-md text-black bg-white w-full mb-4"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <div className="flex justify-between gap-2">
              <button
                className="px-3 py-1 rounded-md bg-gray-500 text-white cursor-pointer"
                onClick={() => setShowPopup(false)}
              >
                Batal
              </button>
              <button
                className="px-3 py-1 rounded-md bg-blue-500 text-white cursor-pointer"
                onClick={addActivity}
                disabled={posting}
              >
                {posting ? "Menambahkan..." : "Tambahkan"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActivityManager;
