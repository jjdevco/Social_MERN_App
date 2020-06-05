import api from "../../services/api";
import {
  SET_AUTHENTICATED,
  SET_USER,
  MARK_NOTIFICATIONS_READ,
  REMOVE_NOTIFICATION,
  REMOVE_ALL_NOTIFICATIONS,
} from "../types";

export const initialize = () => async (dispatch) =>
  await api.user
    .getFullData()
    .then(({ data }) => dispatch({ type: SET_USER, payload: data }))
    .catch((err) => {
      console.log(err.response);
      console.log(err);
    });

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
