import axios from "axios";

const baseURL = `http://localhost:5000/socialapp-94844/us-central1/api`;

const defaultOptions = () => {
  const token = localStorage.authToken;
  return {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

export default {
  user: {
    signUp: (data, options = {}) =>
      axios.post(`${baseURL}/signup`, data, {
        ...defaultOptions(),
        ...options,
      }),

    signIn: (data, options = {}) =>
      axios.post(`${baseURL}/signin`, data, {
        ...defaultOptions(),
        ...options,
      }),

    getFullData: (options = {}) =>
      axios.get(`${baseURL}/user`, {
        ...defaultOptions(),
        ...options,
      }),
  },

  entries: {
    getAll: (options = {}) =>
      axios.get(`${baseURL}/entries`, {
        ...defaultOptions(),
        ...options,
      }),

    getComments: (id, options = {}) =>
      axios.get(`${baseURL}/entry/${id}/comments`, {
        ...defaultOptions(),
        ...options,
      }),

    like: (id, options = {}) =>
      axios.post(`${baseURL}/entry/${id}/like`, null, {
        ...defaultOptions(),
        ...options,
      }),

    unlike: (id, options = {}) =>
      axios.post(`${baseURL}/entry/${id}/unlike`, null, {
        ...defaultOptions(),
        ...options,
      }),
  },

  comments: {
    send: (id, body, options = {}) =>
      axios.post(
        `${baseURL}/entry/${id}/comment`,
        { body },
        {
          ...defaultOptions(),
          ...options,
        }
      ),
  },
};
