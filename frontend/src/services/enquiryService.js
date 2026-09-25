const API_URL = "http://localhost:5000/api/enquiries";

export const createEnquiry = async (enquiryData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enquiryData),
  });

  if (!response.ok) {
    throw new Error("Failed to submit enquiry.");
  }

  const result = await response.json();

  return result.data;
};