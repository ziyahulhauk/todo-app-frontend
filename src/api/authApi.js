import axios from "axios";

const API =
  "http://localhost:5000/api/auth";

/* ================= LOGIN ================= */

export const loginUser = (data) =>
  axios.post(
    `${API}/login`,
    data
  );

/* ================= REGISTER ================= */

export const registerUser = (
  data
) =>
  axios.post(
    `${API}/register`,
    data
  );

/* ================= GET CURRENT USER ================= */

export const getCurrentUser = (
  token
) => {
  return axios.get(
    `${API}/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/* ================= UPDATE USER ================= */

export const updateUser = (
  token,
  data
) => {
  return axios.put(
    `${API}/update`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};