import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { CiCirclePlus } from "react-icons/ci";
// import { IoTrashOutline } from "react-icons/io5";
// import { FaRegEdit } from "react-icons/fa";
import useFetchTasks from "../../hooks/task-manager/use-get-task"; // Custom hook to fetch tasks
import usePostTask from "../../hooks/task-manager/use-post-task"; // Custom hook to post a new task
import { Task } from "@/types/task-manager";

const TaskManager = ({ selectedDate }: { selectedDate: Date }) => {
  // Get tasks from hook; rename "task" to "tasks"
  const { task: tasksFromHook, error, loading } = useFetchTasks();
  const { postData, loading: posting } = usePostTask();

  // Local state for tasks to update immediately without a full refetch.
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  // Sync localTasks with hook data.
  useEffect(() => {
    if (tasksFromHook) {
      setLocalTasks(tasksFromHook);
    }
  }, [tasksFromHook]);

  // Local state for popup and new task inputs.
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const [newTask, setNewTask] = useState("");
  const [newInvitee, setNewInvitee] = useState("");
  const [newDueDate, setNewDueDate] = useState(
    format(selectedDate, "yyyy-MM-dd")
  );

  // Update default due date when selectedDate changes.
  useEffect(() => {
    setNewDueDate(format(selectedDate, "yyyy-MM-dd"));
  }, [selectedDate]);

  // Filter tasks for the selected date.
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const tasksForSelectedDate = localTasks.filter(
    (task) => format(new Date(task.due_date), "yyyy-MM-dd") === dateKey
  );

  // Toggle the popup position.
  const togglePopup = () => {
    if (!showPopup && buttonRef.current) {
      const rect = (buttonRef.current as HTMLElement).getBoundingClientRect();
      setPopupPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 120,
      });
    }
    setShowPopup((prev) => !prev);
  };

  // Add a new task and update local state.
  const addTask = async () => {
    if (!newTask.trim() || !newInvitee.trim() || !newDueDate.trim()) return;
    try {
      // Post new task and get the new task object from the API.
      const newTaskObj = await postData({
        description: newTask,
        invitee: newInvitee,
        due_date: newDueDate,
      });
      // Optimistically update localTasks by appending the new task.
      setLocalTasks((prevTasks) => [...prevTasks, newTaskObj]);
      // Reset inputs and hide popup.
      setNewTask("");
      setNewInvitee("");
      setNewDueDate(format(selectedDate, "yyyy-MM-dd"));
      setShowPopup(false);
      // Optionally, you can call refetch() here to re-sync with the server.
      // refetch();
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  return (
    <div className="relative p-4 rounded-lg text-white w-full bg-[#1D283A] h-[500px]">
      {/* Header with date and plus icon */}
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

      {/* Display loading or error messages */}
      {loading && <p>Loading tasks...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Task list with scroll enabled */}
      {tasksForSelectedDate.length === 0 ? (
        <p className="text-center bg-gray-700 p-4 rounded-2xl">
          Tidak ada tugas di tanggal ini !
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
