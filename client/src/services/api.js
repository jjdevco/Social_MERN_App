import axios from "axios";

export default (token = null) => {
  const baseURL = `http://localhost:5000/socialapp-94844/us-central1/api`;
  const defaultOptions = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  return {
    user: {
      signUp: (data, options = {}) =>
        axios.post(`${baseURL}/signup`, data, {
          ...defaultOptions,
          ...options,
        }),

      signIn: (data, options = {}) =>
        axios.post(`${baseURL}/signin`, data, {
          ...defaultOptions,
          ...options,
        }),

      getFullData: (options = {}) =>
        axios.get(`${baseURL}/user`, {
          ...defaultOptions,
          ...options,
        }),
    },

    entries: {
      getAll: (options = {}) =>
        axios.get(`${baseURL}//entries`, {
          ...defaultOptions,
          ...options,
        }),

      getComments: (id, options = {}) =>
        axios.get(`${baseURL}//entry/${id}/comments`, {
          ...defaultOptions,
          ...options,
        }),
    },
  };
};
