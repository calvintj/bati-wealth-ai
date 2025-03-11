const fetchQuarterlyFUM = async () => {
    const token = localStorage.getItem("token");
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const rm_number = tokenPayload.rm_number;
  
    const response = await fetch(
      `http://localhost:5000/api/overview/quarterly-fum?rm_number=${rm_number}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
  return data;
};

export default fetchQuarterlyFUM;
