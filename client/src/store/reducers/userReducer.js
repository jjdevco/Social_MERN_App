import jwtDecode from "jwt-decode";

import { SET_AUTHENTICATED, SET_USER } from "../types";

const authenticated = () => {
  const token = localStorage.authToken;
  return token ? jwtDecode(token).exp * 1000 > Date.now() : false;
};

const initialState = {
  authenticated: authenticated(),
  credentials: {},
  likes: [],
  notifications: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.payload,
      };

    case SET_USER: {
      return {
        authenticated: true,
        ...action.payload,
      };
    }

    default:
      return state;
  }
}
