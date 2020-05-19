import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:5000/socialapp-94844/us-central1/api`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  signup(userData) {
    return api.post("/signup", userData);
  },

  signin(userData) {
    return api.post("/signin", userData);
  },

  getAllEntries() {
    return api.get("/entries");
  },

  getEntryComments(id) {
    return api.get(`/entry/${id}/comments`);
  },
};
