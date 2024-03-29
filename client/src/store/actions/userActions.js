import jwtDecode from "jwt-decode";

import api from "../../services/api";
import {
  SET_AUTHENTICATED,
  SET_USER,
  SET_PROFILE,
  MARK_NOTIFICATIONS_READ,
  REMOVE_NOTIFICATION,
  REMOVE_ALL_NOTIFICATIONS,
  UPDATE_AVATAR,
  UPDATE_DETAILS,
  CLEAR_USER,
} from "../types";

export const checkAuth = () => (dispatch, getState) => {
  const token = localStorage.authToken;

  const { user } = getState();

  if (token && jwtDecode(token).exp * 1000 < Date.now()) {
    dispatch({
      type: SET_USER,
      payload: { credentials: {}, likes: [], notifications: [] },
    });

    dispatch({
      type: SET_AUTHENTICATED,
      payload: false,
    });

    return localStorage.removeItem("authToken");
  } else {
    if (user.authenticated && !user.credentials.username)
      return api.user
        .getFullData()
        .then(({ data }) => dispatch({ type: SET_USER, payload: data }))
        .catch((err) => {
          console.log(err.response);
          console.log(err);
        });
  }
};

export const authenticate = (token) => async (dispatch) => {
  if (token) {
    localStorage.setItem("authToken", token);

    await dispatch({
      type: SET_AUTHENTICATED,
      payload: true,
    });

    await api.user
      .getFullData()
      .then(({ data }) => dispatch({ type: SET_USER, payload: data }))
      .catch((err) => console.log(err));
  } else {
    dispatch({
      type: SET_AUTHENTICATED,
      payload: false,
    });
  }
};

export const getProfile = (username) => (dispatch) => {
  return api.user
    .getProfile(username)
    .then(({ data }) =>
      dispatch({
        type: SET_PROFILE,
        payload: data,
      })
    )
    .catch((err) => console.log(err));
};

export const markNotifications = (notifications) => async (dispatch) => {
  await dispatch({ type: MARK_NOTIFICATIONS_READ, payload: notifications });
  return api.notifications
    .read(notifications.map((el) => el.id))
    .then(({ data }) => console.log(data))
    .catch((err) => {
      console.log(err.response);
      console.log(err);
    });
};

export const deleteNotifications = (notifications) => async (dispatch) => {
  notifications.length > 1
    ? await dispatch({ type: REMOVE_ALL_NOTIFICATIONS })
    : await dispatch({
        type: REMOVE_NOTIFICATION,
        payload: notifications[0],
      });
  return api.notifications
    .delete(notifications)
    .then(({ data }) => console.log(data))
    .catch((err) => {
      console.log(err.response);
      console.log(err);
    });
};

export const updateAvatar = (url) => (dispatch) =>
  dispatch({
    type: UPDATE_AVATAR,
    payload: url,
  });

export const updateDetails = (data) => (dispatch) =>
  dispatch({
    type: UPDATE_DETAILS,
    payload: data,
  });

export const logOut = () => (dispatch) => {
  localStorage.removeItem("authToken");
  return dispatch({
    type: CLEAR_USER,
  });
};
