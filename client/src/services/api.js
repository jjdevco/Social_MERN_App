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

    getProfile: (username, options = {}) =>
      axios.get(`${baseURL}/user/profile/${username}`, {
        ...defaultOptions(),
        ...options,
      }),

    searchUsers: (username, options = {}) =>
      axios.get(`${baseURL}/user/profiles/${username}`, {
        ...defaultOptions(),
        ...options,
      }),

    changeAvatar: (data, options = {}) =>
      axios.post(`${baseURL}/user/avatar`, data, {
        ...defaultOptions(),
        ...options,
      }),

    updateInfo: (data, options = {}) =>
      axios.post(`${baseURL}/user/details`, data, {
        ...defaultOptions(),
        ...options,
      }),
  },

  entries: {
    send: (data, options = {}) =>
      axios.post(`${baseURL}/entry`, data, {
        ...defaultOptions(),
        ...options,
      }),

    getOne: (id, options = {}) =>
      axios.get(`${baseURL}/entry/${id}`, {
        ...defaultOptions(),
        ...options,
      }),

    getAll: (options = {}) =>
      axios.get(`${baseURL}/entries`, {
        ...defaultOptions(),
        ...options,
      }),

    getByUser: (username, options = {}) =>
      axios.get(`${baseURL}/entries/user/${username}`, {
        ...defaultOptions(),
        ...options,
      }),

    getComments: (id, options = {}) =>
      axios.get(`${baseURL}/entry/${id}/comments`, {
        ...defaultOptions(),
        ...options,
      }),

    delete: (id, options = {}) =>
      axios.delete(`${baseURL}/entry/${id}`, {
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
    send: (data, options = {}) =>
      axios.post(`${baseURL}/entry/${data.id}/comment`, data, {
        ...defaultOptions(),
        ...options,
      }),
  },

  notifications: {
    read: (data, options = {}) =>
      axios.post(`${baseURL}/notifications/read`, data, {
        ...defaultOptions(),
        ...options,
      }),

    delete: (data, options = {}) =>
      axios.post(`${baseURL}/notifications/delete`, data, {
        ...defaultOptions(),
        ...options,
      }),
  },
};
