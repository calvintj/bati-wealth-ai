"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { CirclePlus, Trash, Pencil } from "lucide-react";
import { TaskResponse, TaskRow } from "@/types/page/task-manager";
import {
  usePostTask,
  useGetTask,
  useDeleteTask,
  useUpdateTask,
} from "@/hooks/recommendation-centre/use-task-manager";
import { useQueryClient } from "@tanstack/react-query";
import { usePagePermissions } from "@/hooks/permissions/use-page-permissions";
import { checkPermissionBeforeAction } from "@/utils/permission-checker";

const TaskManager = ({ selectedDate }: { selectedDate: Date }) => {
  // React Query hook for tasks
  const { data: taskResponse, error, isLoading } = useGetTask();
  const { mutateAsync: postData } = usePostTask();
  const { mutateAsync: deleteData } = useDeleteTask();
  const { mutateAsync: updateData } = useUpdateTask();
  const queryClient = useQueryClient();
  
  // Get permissions for recommendation-centre page
  const { canAdd, canUpdate, canDelete } = usePagePermissions();

  // Popup state and positioning
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // New task form state
  const [newTask, setNewTask] = useState("");
  const [newInvitee, setNewInvitee] = useState("");
  const [newDueDate, setNewDueDate] = useState(
    format(selectedDate, "yyyy-MM-dd")
  );

  // Add state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRow | null>(null);

  // Update due date when selectedDate changes.
  useEffect(() => {
    setNewDueDate(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate]);

  // Filter tasks for the selected date using query data
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const tasksForSelectedDate = useMemo(() => {
    if (!taskResponse) return [];
    return taskResponse.task.filter(
      (task) => format(new Date(task.due_date), "yyyy-MM-dd") === dateKey
    );
  }, [taskResponse, dateKey]);

  // Toggle popup position based on the add button's location.
  const togglePopup = () => {
    // Check permission before allowing to add
    if (!showPopup && !checkPermissionBeforeAction(canAdd, "create", "task")) {
      return;
    }
    if (!showPopup && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const popupWidth = 320; // Increased width for better form layout

      // For mobile screens (width < 768px), center the popup
      if (windowWidth < 768) {
        const left = (windowWidth - popupWidth) / 2;
        const top = Math.min(rect.bottom + window.scrollY, windowHeight * 0.3);
        setPopupPosition({ top, left });
      } else {
        // Desktop positioning logic
        let left = rect.left + window.scrollX - 160;
        let top = rect.bottom + window.scrollY;

        // Adjust horizontal position if popup would go off screen
        if (left + popupWidth > windowWidth) {
          left = windowWidth - popupWidth - 16;
        }
        if (left < 16) {
          left = 16;
        }

        // Adjust vertical position if popup would go off screen
        if (top + 400 > windowHeight) {
          top = rect.top + window.scrollY - 400 - 8;
        }

        setPopupPosition({ top, left });
      }
    }
    setShowPopup((prev) => !prev);
  };

  // Reset form function
  const resetForm = () => {
    setNewTask("");
    setNewInvitee("");
    setNewDueDate(format(selectedDate, "yyyy-MM-dd"));
    setShowPopup(false);
    setIsEditing(false);
    setEditingTask(null);
  };

  // Handle edit click with the same positioning logic
  const handleEdit = (task: TaskRow) => {
    // Check permission before allowing to edit
    if (!checkPermissionBeforeAction(canUpdate, "update", "task")) {
      return;
    }
    setIsEditing(true);
    setEditingTask(task);
    setNewTask(task.description);
    setNewInvitee(task.invitee);
    setNewDueDate(format(new Date(task.due_date), "yyyy-MM-dd"));

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const popupWidth = 320;

      let left = rect.left + window.scrollX - 160;
      let top = rect.bottom + window.scrollY;

      if (left + popupWidth > windowWidth) {
        left = windowWidth - popupWidth - 16;
      }
      if (left < 16) {
        left = 16;
      }

      if (top + 400 > windowHeight) {
        top = rect.top + window.scrollY - 400 - 8;
      }

      setPopupPosition({ top, left });
    }
    setShowPopup(true);
  };

  // Handle delete
  const handleDelete = async (taskId: string) => {
    // Check permission before allowing to delete
    if (!checkPermissionBeforeAction(canDelete, "delete", "task")) {
      return;
    }

    try {
      await deleteData(taskId);
      // Update local cache immediately for better UX
      queryClient.setQueryData<TaskResponse>(["task"], (oldData) => {
        if (!oldData) return oldData;
        return {
          task: oldData.task.filter((t) => t.id !== taskId),
        };
      });
      // Invalidate query to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ["task"] });
    } catch (err) {
      console.error("Failed to delete task:", err);
      // Show error to user
      alert("Failed to delete task. Please try again.");
    }
  };

  // Modify addTask to handle both add and edit
  const handleSubmit = async () => {
    if (!newTask.trim() || !newInvitee.trim() || !newDueDate.trim()) return;

    // Check permission before submitting
    if (isEditing) {
      if (!checkPermissionBeforeAction(canUpdate, "update", "task")) {
        return;
      }
    } else {
      if (!checkPermissionBeforeAction(canAdd, "create", "task")) {
        return;
      }
    }

    try {
      if (isEditing && editingTask) {
        const updatedTask = {
          ...editingTask,
          description: newTask,
          invitee: newInvitee,
          due_date: newDueDate,
        };

        await updateData(updatedTask);
        queryClient.setQueryData<TaskResponse>(["task"], (oldData) => {
          if (!oldData) return oldData;
          return {
            task: oldData.task.map((t) =>
              t.id === editingTask.id ? updatedTask : t
            ),
          };
        });
      } else {
        const newTaskResponse = await postData({
          id: "",
          description: newTask,
          invitee: newInvitee,
          due_date: newDueDate,
        });
        queryClient.setQueryData<TaskResponse>(["task"], (oldData) => {
          if (!oldData) return newTaskResponse;
          return {
            task: [...oldData.task, ...newTaskResponse.task],
          };
        });
      }

      resetForm();
    } catch (err) {
      console.error("Failed to handle task:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-600 dark:text-gray-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mb-2"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 dark:text-red-400">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-[600px] border-1 border-gray-300 dark:border-none rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Task Manager
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {format(selectedDate, "d MMMM yyyy", { locale: id })}
          </p>
        </div>
        <button
          ref={buttonRef}
          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer"
          onClick={togglePopup}
          aria-label="Add Task"
        >
          <CirclePlus className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1">
        {tasksForSelectedDate.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-600 dark:text-gray-300">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>Tidak ada tugas di tanggal ini!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {tasksForSelectedDate.map((task, index) => (
              <div
                key={task.id || index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-200 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {task.description}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>Undangan: {task.invitee}</p>
                  <p>Due: {format(new Date(task.due_date), "yyyy-MM-dd")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup */}
      {showPopup &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top:
                window.innerWidth < 768 ? popupPosition.top : popupPosition.top,
              zIndex: 1000,
              maxHeight:
                window.innerWidth < 768 ? "70vh" : "calc(100vh - 32px)",
              overflowY: "auto",
              width: window.innerWidth < 768 ? "90%" : "320px",
              transform: window.innerWidth < 768 ? "translateX(-50%)" : "none",
              left: window.innerWidth < 768 ? "50%" : popupPosition.left,
            }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {isEditing ? "Edit Tugas" : "Tambah Tugas"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {format(selectedDate, "d MMMM yyyy", { locale: id })}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deskripsi Tugas
                </label>
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Masukkan deskripsi tugas"
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Undangan
                </label>
                <input
                  type="text"
                  value={newInvitee}
                  onChange={(e) => setNewInvitee(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Masukkan nama undangan"
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
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

export default TaskManager;
