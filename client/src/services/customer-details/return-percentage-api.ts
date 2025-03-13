const fetchReturnPercentage = async (customerID: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await fetch(
    `http://localhost:5000/api/customer-details/return-percentage?customerID=${customerID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export default fetchReturnPercentage;