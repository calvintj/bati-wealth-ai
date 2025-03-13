const fetchRecommendationProduct = async (customerID: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Token not found");
    }
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