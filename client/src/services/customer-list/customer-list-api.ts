import { Customer } from "@/types/customer-list";

const fetchCustomerList = (setCustomerList: (data: Customer[]) => void) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const rm_number = tokenPayload.rm_number;

  fetch(
    `http://localhost:5000/api/customer-list/customer-list?rm_number=${rm_number}`,
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
      setCustomerList(data);
    })
    .catch((err) => {
      console.error("Error fetching customer list:", err);
    });
};

export default fetchCustomerList;
