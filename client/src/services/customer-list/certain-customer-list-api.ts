const fetchCertainCustomerList = (setCustomerList, propensity, aum) => {
    const token = localStorage.getItem("token");
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const rm_number = tokenPayload.rm_number;

    fetch(
      `http://localhost:5000/api/customer-list/customer-list/certain?rm_number=${rm_number}&propensity=${propensity}&aum=${aum}`,
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

export default fetchCertainCustomerList;
