const fetchOwnedProduct = async (customerID) => {
  const token = localStorage.getItem("token");
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const rm_number = tokenPayload.rm_number;

  return fetch(
    `http://localhost:5000/api/customer-details/owned-product?rm_number=${rm_number}&customerID=${customerID}`,
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
    .catch((err) => {
      console.error("Error fetching owned product:", err);
      throw err;
    });
};

export default fetchOwnedProduct;
