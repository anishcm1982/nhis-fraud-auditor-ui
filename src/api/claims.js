import axios from "axios";

const API = "http://localhost:8080/api/claims";

export const uploadCsv = (formData) =>
  axios.post(`${API}/upload`, formData);

//export const getFlaggedClaims = (threshold) =>
  //axios.get(`${API}/flagged?threshold=${threshold}`);

//export const markReview = (id, status) =>
  //axios.post(`${API}/${id}/review?status=${status}`);

// Fetch flagged claims with a threshold
export const getFlaggedClaims = (threshold) => {
  return axios.get(`${API}/flagged`, {
    params: { threshold: threshold }    // safer query param handling
  });
};

// Mark a claim as reviewed (APPROVED / REJECTED / INVESTIGATE)
export const markReview = (id, status) => {
  return axios.post(`${API}/${id}/review`, null, {
    params: { status: status }
  });
};