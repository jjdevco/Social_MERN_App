import api from "../../services/api";
import { SET_AUTHENTICATED, SET_USER } from "../types";

export const authenticate = (token) => async (dispatch) => {
  if (token) {
    localStorage.setItem("authToken", token);

    await dispatch({
      type: SET_AUTHENTICATED,
      payload: true,
    });

    await api(token)
      .user.getFullData()
      .then(({ data }) => dispatch({ type: SET_USER, payload: data }))
      .catch((err) => console.log(err));
  } else {
    dispatch({
      type: SET_AUTHENTICATED,
      payload: false,
    });
  }
};
