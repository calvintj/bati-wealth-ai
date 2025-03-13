const fetchManagedNumbers = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const rm_number = tokenPayload.rm_number;

  const response = await fetch(
    `http://localhost:5000/api/task-manager/increased-number?rm_number=${rm_number}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default fetchManagedNumbers;
