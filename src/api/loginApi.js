import axios from "axios";

export const loginUser = (data) =>
  axios.post("https://todo-hqdd.onrender.com/api/auth/login", data);