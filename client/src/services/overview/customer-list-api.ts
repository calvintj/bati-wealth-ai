const fetchCertainCustomerList = (setCustomerList, customerRisk) => {
  const token = localStorage.getItem("token");
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const rm_number = tokenPayload.rm_number;

  console.log("Fetching with customerRisk:", customerRisk);

  fetch(
    `http://localhost:5000/api/overview/certain-customer-list?rm_number=${rm_number}&customerRisk=${customerRisk}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Received data:", data);
      setCustomerList(data);
    })
    .catch((err) => {
      console.error("Error fetching customer list:", err);
    });
};

export default fetchCertainCustomerList;
