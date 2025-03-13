const fetchCustomerDetails = async (customerID: string) => {
  try {
    // Don't proceed if customerID is empty
    if (!customerID) {
      return null;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const rm_number = tokenPayload.rm_number;

    const response = await fetch(
      `http://localhost:5000/api/customer-details/customer-details?rm_number=${rm_number}&customerID=${customerID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    // Check if response has content before parsing
    const text = await response.text();
    if (!text) {
      return null; // Return null for empty responses
    }

    // Parse the text as JSON
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in fetchCustomerDetails:", error);
    throw error;
  }
};

export default fetchCustomerDetails;
