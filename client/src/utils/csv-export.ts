export interface CustomerData {
  "Customer ID": string;
  "Risk Profile": string;
  "AUM Label": string;
  Propensity: string;
  "Priority / Private": string;
  "Customer Type": string;
  Pekerjaan: string;
  "Status Nikah": string;
  Usia: number;
  "Annual Income": number;
  "Total FUM": number;
  "Total AUM": number;
  "Total FBI": number;
}

export const exportToCSV = (data: CustomerData[], filename: string = "customers") => {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(","),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof CustomerData];
          // Handle values that might contain commas or quotes
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


