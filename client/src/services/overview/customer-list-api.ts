// Define a proper interface for the customer data
interface Customer {
  id: string;
  name: string;
  risk_profile: string;
  total_investment: number;
  last_transaction_date: string;
  // Add other properties as needed
}

const fetchCertainCustomerList = (
  setCustomerList: (data: Customer[]) => void,
  customerRisk: string
) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
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
    .then((data: Customer[]) => {
      console.log("Received data:", data);
      setCustomerList(data);
    })
    .catch((err) => {
      console.error("Error fetching customer list:", err);
    });
};

export default fetchCertainCustomerList;
