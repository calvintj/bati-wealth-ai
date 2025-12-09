import api from "@/services/api";
import { TaskResponse, TaskRow } from "@/types/page/task-manager";
import axios from "axios";

const getTask = async (): Promise<TaskResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    let tokenPayload;
    try {
      tokenPayload = JSON.parse(atob(token.split(".")[1]));
    } catch {
      throw new Error("Invalid token format");
    }
    const rm_number = tokenPayload.rm_number;

    const response = await api.get("/task-manager/get-task", {
      params: { rm_number },
    });

    return response.data as TaskResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

const postTask = async (task: TaskRow): Promise<TaskResponse> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    let tokenPayload;
    try {
      tokenPayload = JSON.parse(atob(token.split(".")[1]));
    } catch {
      throw new Error("Invalid token format");
    }
    const rm_number = tokenPayload.rm_number;

    const payload = { ...task, rm_number };
    const response = await api.post("/task-manager/post-task", payload);
    return response.data as TaskResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response);
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

const deleteTask = async (task_id: string): Promise<TaskResponse> => {
  try {
    const response = await api.delete("/task-manager/delete-task", {
      params: { id: task_id }, // Backend expects 'id' not 'task_id'
    });
    return response.data as TaskResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

const updateTask = async (task: TaskRow): Promise<TaskResponse> => {
  try {
    const response = await api.put("/task-manager/update-task", task, {
      params: { task_id: task.id },
    });
    return response.data as TaskResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
  }
};

export { getTask, postTask, deleteTask, updateTask };
