import api from "@/services/api";
import { TaskResponse, TaskRow } from "@/types/page/task-manager";
import axios from "axios";

const getToken = () => localStorage.getItem("token");

const getTask = async (): Promise<TaskResponse> => {
  const token = getToken();
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

  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { rm_number },
    };
    const response = await api.get("/task-manager/get-task", config);

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
  const token = getToken();
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

  try {
    const payload = { ...task, rm_number };
    console.log("payload", payload);
    const response = await api.post("/task-manager/post-task", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("responseeeeeee", response.data);
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
  const token = getToken();
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await api.delete("/task-manager/delete-task", {
      headers: { Authorization: `Bearer ${token}` },
      params: { task_id },
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
  const token = getToken();
  if (!token) {
    throw new Error("Token not found");
  }

  try {
    const response = await api.put("/task-manager/update-task", {
      params: { task_id: task.id },
      headers: { Authorization: `Bearer ${token}` },
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
