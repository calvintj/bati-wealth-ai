import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CirclePlus, Trash2, Pencil } from "lucide-react";
import {
  useGetActivity,
  usePostActivity,
  useDeleteActivity,
  useUpdateActivity,
} from "@/hooks/customer-details/use-activity-manager";
import { Activity } from "@/types/page/customer-details";

const ActivityManager = ({ customerID }: { customerID: string }) => {
  const {
    data: activityFromHook,
    error,
    isLoading: loading,
    refetch,
  } = useGetActivity(customerID);
  const { mutate: postData } = usePostActivity();
  const { mutate: deleteData } = useDeleteActivity();
  const { mutate: updateData } = useUpdateActivity();

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

  // Add state to track if we're editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string>("");

  // Add a function to update popup position
  const updatePopupPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 240,
      });
    }
  };

  // Toggle the popup position at the bottom left of the button.
  const togglePopup = () => {
    if (!showPopup) {
      updatePopupPosition();
    }
    setShowPopup((prev) => !prev);
  };

  // Modify addActivity to handle both create and update
  const handleActivitySubmit = async () => {
    if (!newActivity.trim() || !newDescription.trim() || !newDate.trim())
      return;

    const activityObj = {
      id: isEditing ? editingActivityId : "",
      bp_number_wm_core: customerID,
      title: newActivity,
      description: newDescription,
      date: newDate,
    } as Activity;

    try {
      if (isEditing) {
        updateData(activityObj, {
          onSuccess: () => {
            refetch();
            resetForm();
          },
        });
      } else {
        postData(activityObj, {
          onSuccess: () => {
            refetch();
            resetForm();
          },
        });
      }
    } catch (err) {
      console.error("Failed to handle activity:", err);
    }
  };

  const resetForm = () => {
    setNewActivity("");
    setNewDescription("");
    setNewDate(today);
    setShowPopup(false);
    setIsEditing(false);
    setEditingActivityId("");
  };

  // Update handleEdit to use the button's position
  const handleEdit = (activity: Activity) => {
    setIsEditing(true);
    setEditingActivityId(activity.id);
    setNewActivity(activity.title);
    setNewDescription(activity.description);
    setNewDate(activity.date.split("T")[0]);
    updatePopupPosition();
    setShowPopup(true);
  };

  const deleteActivity = async (id: string) => {
    deleteData(id, {
      onSuccess: () => {
        refetch();
      },
    });
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
          <CirclePlus />
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
              <div className="flex flex-row gap-2">
                <p className="text-xs text-gray-400">
                  {activity.date.split("T")[0]}
                </p>
                <button
                  className="text-gray-100 hover:text-gray-300 cursor-pointer"
                  onClick={() => handleEdit(activity)}
                >
                  <Pencil />
                </button>
                <button
                  className="text-gray-100 hover:text-gray-300 cursor-pointer"
                  onClick={() => deleteActivity(activity.id)}
                >
                  <Trash2 />
                </button>
              </div>
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
            <h4 className="text-white mb-2">
              {isEditing ? "Edit Aktivitas" : "Tambah Aktivitas"}
            </h4>
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleActivitySubmit();
                }
              }}
              placeholder="Aktivitas"
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleActivitySubmit();
                }
              }}
              placeholder="Deskripsi"
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleActivitySubmit();
                }
              }}
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="w-1/2 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleActivitySubmit}
                className="w-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                {isEditing ? "Simpan" : "Tambahkan"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ActivityManager;
