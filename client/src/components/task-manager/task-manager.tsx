"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { CiCirclePlus } from "react-icons/ci";
import { TaskResponse } from "@/types/page/task-manager";
import { usePostTask, useGetTask } from "@/hooks/task-manager/use-task-manager";
import { useQueryClient } from "@tanstack/react-query";

const TaskManager = ({ selectedDate }: { selectedDate: Date }) => {
  // React Query hook for tasks
  const { data: taskResponse, error, isLoading } = useGetTask();
  const { mutateAsync: postData } = usePostTask();
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
            style={{
              position: "absolute",
              top: popupPosition.top,
              left: popupPosition.left,
            }}
            className="bg-gray-800 p-4 rounded-lg shadow-lg w-60 border border-gray-600"
          >
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Tugas"
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <input
              type="text"
              value={newInvitee}
              onChange={(e) => setNewInvitee(e.target.value)}
              placeholder="Undangan"
              className="w-full mb-2 p-2 rounded bg-white text-black"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
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
                onClick={addTask}
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

export default TaskManager;
