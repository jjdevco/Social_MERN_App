import jwtDecode from "jwt-decode";

import {
  SET_AUTHENTICATED,
  SET_USER,
  MARK_NOTIFICATIONS_READ,
  REMOVE_NOTIFICATION,
  REMOVE_ALL_NOTIFICATIONS,
} from "../types";

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

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: payload,
      };

    case SET_USER: {
      return {
        authenticated: true,
        ...payload,
      };
    }

    case MARK_NOTIFICATIONS_READ: {
      return {
        ...state,
        notifications: [
          ...state.notifications.filter((el) => el.read),
          ...payload,
        ].sort((a, b) => b.createdAt - a.createdAt),
      };
    }

    case REMOVE_NOTIFICATION: {
      return {
        ...state,
        notifications: [
          ...state.notifications.filter((el) =>
            el.id !== payload ? el : null
          ),
        ],
      };
    }

    case REMOVE_ALL_NOTIFICATIONS: {
      return {
        ...state,
        notifications: [],
      };
    }

    default:
      return state;
  }
}
