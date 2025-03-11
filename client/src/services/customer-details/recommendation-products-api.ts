const fetchRecommendationProduct = async (customerID) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `http://localhost:5000/api/customer-details/recommendation-product?customerID=${customerID}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json(); // this should return an array of customer objects
};

export default fetchRecommendationProduct;