import API from "./api";

export const getLeads = async (page = 1) => {

  const response = await API.get(
    `/leads?page=${page}`
  );

  return response.data;
};