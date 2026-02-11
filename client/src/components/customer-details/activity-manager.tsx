import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  CirclePlus,
  Trash2,
  Pencil,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  useGetActivity,
  usePostActivity,
  useDeleteActivity,
  useUpdateActivity,
} from "@/hooks/customer-details/use-activity-manager";
import { Activity, ActivityResponse } from "@/types/page/customer-details";
import { exportToCSV } from "@/utils/csv-export";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  // Get permissions for customer-details page
  const { canAdd, canUpdate, canDelete } = usePagePermissions();

  // Initialize with empty array
  const [localActivity, setLocalActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const activityData = activityFromHook as ActivityResponse | undefined;
    if (activityData?.data) {
      setLocalActivity(activityData.data);
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

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
          onError: (error: any) => {
            // Error will be handled by API interceptor
            console.error("Failed to update activity:", error);
          },
        });
      } else {
        postData(activityObj, {
          onSuccess: () => {
            refetch();
            resetForm();
          },
          onError: (error: any) => {
            // Error will be handled by API interceptor
            console.error("Failed to create activity:", error);
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

  const handleDelete = (id: string) => {
    setActivityToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!activityToDelete) return;

    deleteData(activityToDelete, {
      onSuccess: () => {
        refetch();
        toast.success("Aktivitas berhasil dihapus", {
          description: "Aktivitas telah dihapus dari sistem",
          duration: 3000,
        });
        setShowDeleteDialog(false);
        setActivityToDelete(null);
      },
      onError: (error: any) => {
        // Error will be handled by API interceptor
        console.error("Failed to delete activity:", error);
        setShowDeleteDialog(false);
        setActivityToDelete(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setActivityToDelete(null);
  };

  const handleExport = () => {
    if (localActivity.length === 0) return;

    const exportData = localActivity.map((activity) => ({
      Title: activity.title,
      Description: activity.description,
      Date: activity.date.split("T")[0],
    }));
    exportToCSV(exportData, `activities_${customerID}`);
  };

  return (
    <div className="relative p-4 rounded-lg w-full h-full bg-white dark:bg-[#1D283A] text-gray-900 dark:text-white flex flex-col min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold">Aktivitas</h2>
        <div className="flex items-center gap-2">
          {/* {localActivity.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
              title="Ekspor ke CSV"
            >
              <Download size={14} />
              <span>Ekspor</span>
            </button>
          )} */}
          <button
            ref={buttonRef}
            onClick={togglePopup}
            className="text-2xl text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 cursor-pointer transition-colors"
            title={isEditing ? "Edit Aktivitas" : "Tambah Aktivitas"}
            aria-label={isEditing ? "Edit Aktivitas" : "Tambah Aktivitas"}
          >
            <CirclePlus />
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Memuat...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p>Error: {error.message}</p>
          </div>
        ) : localActivity.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-4 rounded-2xl">
              Tidak ada aktivitas tersedia !
            </p>
          </div>
        ) : (
          <ul className="space-y-2 pr-2">
            {localActivity.map((activity, index) => (
              <li
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex justify-between items-center"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-gray-900 dark:text-white">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center flex-shrink-0 ml-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {activity.date.split("T")[0]}
                  </p>
                  <button
                    className="text-gray-600 dark:text-gray-100 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer transition-colors"
                    onClick={() => handleEdit(activity)}
                    title="Edit aktivitas"
                    aria-label="Edit aktivitas"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-gray-600 dark:text-gray-100 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                    onClick={() => handleDelete(activity.id)}
                    title="Hapus aktivitas"
                    aria-label="Hapus aktivitas"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Activity Popup */}
      {showPopup &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-60 border border-gray-200 dark:border-gray-600"
          >
            <h4 className="text-gray-900 dark:text-white mb-2 font-semibold">
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
              className="w-full mb-2 p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full mb-2 p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full mb-2 p-2 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="w-1/2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleActivitySubmit}
                className="w-1/2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer transition-colors"
              >
                {isEditing ? "Simpan" : "Tambahkan"}
              </button>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Hapus Aktivitas
              </DialogTitle>
            </div>
            <DialogDescription className="pt-2 text-sm text-gray-600 dark:text-gray-400">
              Apakah Anda yakin ingin menghapus aktivitas ini? Tindakan ini
              tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={handleCancelDelete}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityManager;
