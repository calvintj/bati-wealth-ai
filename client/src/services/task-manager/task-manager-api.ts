const BASE_URL = 'http://localhost:5000/api/task-manager';
import { Task } from '@/types/task-manager';

// Helper to process responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred while fetching data');
  }
  return response.json();
};

// Function to retrieve token from localStorage
const getToken = () => localStorage.getItem("token");

// GET request including token (if available)
const getTask = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const rm_number = tokenPayload.rm_number;

  const response = await fetch(`${BASE_URL}/get-task?rm_number=${rm_number}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

const postTask = async (data: Task) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/post-task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export { getTask, postTask };