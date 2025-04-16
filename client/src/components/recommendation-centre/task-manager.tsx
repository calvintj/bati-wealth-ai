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

const TaskManager = ({ selectedDate }: { selectedDate: Date }) => {
  // React Query hook for tasks
  const { data: taskResponse, error, isLoading } = useGetTask();
  const { mutateAsync: postData } = usePostTask();
  const { mutateAsync: deleteData } = useDeleteTask();
  const { mutateAsync: updateData } = useUpdateTask();
  const queryClient = useQueryClient();

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

  // Filter tasks for the selecqted date using query data
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const tasksForSelectedDate = useMemo(() => {
    if (!taskResponse) return [];
    return taskResponse.task.filter(
      (task) => format(new Date(task.due_date), "yyyy-MM-dd") === dateKey
    );
  }, [taskResponse, dateKey]);

  // Toggle popup position based on the add button's location.
  const togglePopup = () => {
    if (!showPopup && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const popupWidth = 240; // Width of the popup (w-60 = 15rem = 240px)

      // For mobile screens (width < 768px), center the popup
      if (windowWidth < 768) {
        const left = (windowWidth - popupWidth) / 2;
        const top = Math.min(rect.bottom + window.scrollY, windowHeight * 0.3); // Position at 30% from top
        setPopupPosition({ top, left });
      } else {
        // Desktop positioning logic
        let left = rect.left + window.scrollX - 120;
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
    setIsEditing(true);
    setEditingTask(task);
    setNewTask(task.description);
    setNewInvitee(task.invitee);
    setNewDueDate(format(new Date(task.due_date), "yyyy-MM-dd"));

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const popupWidth = 240;

      let left = rect.left + window.scrollX - 120;
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
    try {
      await deleteData(taskId);
      // Update cache optimistically
      queryClient.setQueryData<TaskResponse>(["task"], (oldData) => {
        if (!oldData) return oldData;
        return {
          task: oldData.task.filter((t) => t.id !== taskId),
        };
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Modify addTask to handle both add and edit
  const handleSubmit = async () => {
    if (!newTask.trim() || !newInvitee.trim() || !newDueDate.trim()) return;

    try {
      if (isEditing && editingTask) {
        const updatedTask = {
          ...editingTask,
          description: newTask,
          invitee: newInvitee,
          due_date: newDueDate,
        };

        await updateData(updatedTask);
        // Update cache optimistically
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
        // Update cache for new task
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

  return (
    <div className="relative p-4 rounded-lg text-black dark:text-white w-full bg-white dark:bg-[#1D283A] h-[500px] border border-gray-300 dark:border-none">
      {/* Header with date and add button */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-bold">
          {format(selectedDate, "d MMMM yyyy", { locale: id })}
        </p>
        <button
          ref={buttonRef}
          className="text-3xl text-blue-500 cursor-pointer"
          onClick={togglePopup}
          aria-label="Add Task"
        >
          <CirclePlus />
        </button>
      </div>

      {/* Display loading or error states */}
      {isLoading && <p>Loading tasks...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Task list */}
      {tasksForSelectedDate.length === 0 ? (
        <p className="text-center bg-gray-300 p-4 rounded-2xl text-black">
          Tidak ada tugas di tanggal ini!
        </p>
      ) : (
        <ul className="mb-4 max-h-80 overflow-y-auto rounded-md">
          {tasksForSelectedDate.map((task, index) => (
            <li
              key={task.id || index}
              className="bg-blue-500 pl-2 mt-2 rounded-2xl text-black dark:text-white"
            >
              <div className="bg-white rounded-2xl p-2 text-black dark:text-white">
                <p className="font-bold">{task.description}</p>
                <p>Invitee: {task.invitee}</p>
                <p>Due: {format(new Date(task.due_date), "yyyy-MM-dd")}</p>
              </div>
              <div className="flex gap-2 p-2">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-black dark:text-white hover:text-gray-200"
                >
                  <Trash className="h-4 w-4 cursor-pointer" />
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="text-black dark:text-white hover:text-gray-200"
                >
                  <Pencil className="h-4 w-4 cursor-pointer" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

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
              width: window.innerWidth < 768 ? "90%" : "240px",
              transform: window.innerWidth < 768 ? "translateX(-50%)" : "none",
              left: window.innerWidth < 768 ? "50%" : popupPosition.left,
            }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-600 text-black dark:text-white"
          >
            <p className="text-black dark:text-white mb-2">
              {isEditing ? "Edit Tugas" : "Tambah Tugas"}
            </p>
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent new line in textarea
                  handleSubmit();
                }
              }}
              placeholder="Tugas"
              className="w-full mb-2 p-2 rounded bg-white text-black border border-gray-600"
            />
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
              placeholder="Undangan"
              className="w-full mb-2 p-2 rounded bg-white text-black border border-gray-600"
            />
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
              className="w-full mb-2 p-2 rounded bg-white text-black border border-gray-600"
            />
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="w-1/2 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
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

export default TaskManager;
