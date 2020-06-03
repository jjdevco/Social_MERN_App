import api from "../../services/api";
import { SET_AUTHENTICATED, SET_USER } from "../types";

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
