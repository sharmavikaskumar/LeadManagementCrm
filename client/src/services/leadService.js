import { FeatherIcon } from "lucide-react";
import API from "./api";

export const getLeads = async (page = 1) => {
  const response = await API.get(`/leads?page=${page}`);
  return response.data;
};

export const cretaeLead = async (leadData) => {
  const response = await API.post("/leads", leadData);
  return leadData;
};

export const updatedLead = async (id, leadData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://192.168.43.11:5000/api/leads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(leadData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.lead;
};

// export const deleteLead = async (id) => {
//   const response = await fetch(`${BASE_URL}/leads/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   const data = await response.json();
//   if (!response.ok) throw new Error(data.message);
//   return data;
// };

export const deleteLead = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://192.168.43.11:5000/api/leads/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const addLeadNote = async (id, text) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/leads/${id}/notes`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
      }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};
