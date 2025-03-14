"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { CiCirclePlus } from "react-icons/ci";
import { TaskResponse } from "@/types/task-manager";
import { usePostTask, useGetTask } from "@/hooks/task-manager/use-task-manager";
import { useQueryClient } from "@tanstack/react-query";

const TaskManager = ({ selectedDate }: { selectedDate: Date }) => {
  // React Query hook for tasks
  const { data: taskResponse, error, isLoading } = useGetTask();
  const { mutateAsync: postData, isPending: posting } = usePostTask();
  const queryClient = useQueryClient();

  // Popup state and positioning
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // New task form state
  const [newTask, setNewTask] = useState("");
  const [newInvitee, setNewInvitee] = useState("");
  const [newDueDate, setNewDueDate] = useState(format(selectedDate, "yyyy-MM-dd"));

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
    if (!showPopup && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 120,
      });
    }
    setShowPopup((prev) => !prev);
  };

  // Add a new task using optimistic update on React Query cache.
  const addTask = async () => {
    if (!newTask.trim() || !newInvitee.trim() || !newDueDate.trim()) return;
    try {
      const newTaskResponse = await postData({
        description: newTask,
        invitee: newInvitee,
        due_date: newDueDate,
      });
      // Update the query cache with the newly added task(s)
      queryClient.setQueryData<TaskResponse>(["task"], (oldData) => {
        if (!oldData) return newTaskResponse;
        return {
          task: [...oldData.task, ...newTaskResponse.task],
        };
      });

      // Reset form inputs and hide popup.
      setNewTask("");
      setNewInvitee("");
      setNewDueDate(format(selectedDate, "yyyy-MM-dd"));
      setShowPopup(false);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  return (
    <div className="relative p-4 rounded-lg text-white w-full bg-[#1D283A] h-[500px]">
      {/* Header with date and add button */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">
          {format(selectedDate, "d MMMM yyyy", { locale: id })}
        </h3>
        <button
          ref={buttonRef}
          className="text-3xl text-blue-500 cursor-pointer"
          onClick={togglePopup}
          aria-label="Add Task"
        >
          <CiCirclePlus />
        </button>
      </div>

      {/* Display loading or error states */}
      {isLoading && <p>Loading tasks...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Task list */}
      {tasksForSelectedDate.length === 0 ? (
        <p className="text-center bg-gray-700 p-4 rounded-2xl">
          Tidak ada tugas di tanggal ini!
        </p>
      ) : (
        <ul className="mb-4 max-h-80 overflow-y-auto rounded-md">
          {tasksForSelectedDate.map((task, index) => (
            <li
              key={index}
              className="bg-blue-500 pl-2 mt-2 rounded-2xl text-black"
            >
              <div className="bg-white rounded-2xl p-2">
                <p className="font-bold">{task.description}</p>
                <p>Invitee: {task.invitee}</p>
                <p>Due: {format(new Date(task.due_date), "yyyy-MM-dd")}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Popup rendered via Portal */}
      {showPopup &&
        createPortal(
          <div
            style={{ top: popupPosition.top, left: popupPosition.left }}
            className="absolute w-60 p-4 bg-[#1D283A] border border-gray-300 rounded-lg shadow-lg z-50"
          >
            <h4 className="text-md font-bold mb-3 text-white">
              Tambahkan tugas baru
            </h4>
            <input
              type="text"
              className="p-2 rounded-md text-black bg-white w-full mb-2"
              placeholder="Deskripsi"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="text"
              className="p-2 rounded-md text-black bg-white w-full mb-2"
              placeholder="Dengan siapa?"
              value={newInvitee}
              onChange={(e) => setNewInvitee(e.target.value)}
            />
            <input
              type="date"
              className="p-2 rounded-md text-black bg-white w-full mb-4"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
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
                onClick={addTask}
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

export default TaskManager;
