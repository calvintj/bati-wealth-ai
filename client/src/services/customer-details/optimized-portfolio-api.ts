const fetchOptimizedPortfolio = async (customerID) => {
  const token = localStorage.getItem("token");
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const rm_number = tokenPayload.rm_number;

  const response = await fetch(
    `http://localhost:5000/api/customer-details/optimized-portfolio?rm_number=${rm_number}&customerID=${customerID}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.json();
};

export default fetchOptimizedPortfolio;
