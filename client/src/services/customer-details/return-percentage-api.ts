const fetchReturnPercentage = async (customerID) => {
  const response = await fetch(
    `http://localhost:5000/api/customer-details/return-percentage?customerID=${customerID}`
  );
  const data = await response.json();
  return data;
};

export default fetchReturnPercentage;