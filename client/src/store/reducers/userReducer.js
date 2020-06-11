import jwtDecode from "jwt-decode";

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

const authenticated = () => {
  const token = localStorage.authToken;
  return token ? jwtDecode(token).exp * 1000 > Date.now() : false;
};

const initialState = {
  authenticated: authenticated(),
  credentials: {},
  likes: [],
  notifications: [],
  profile: {},
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
        ...state,
        ...payload,
        authenticated: true,
      };
    }

    case SET_PROFILE: {
      return {
        ...state,
        profile: !!payload ? { ...payload } : { ...state.credentials },
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

    case UPDATE_AVATAR: {
      return {
        ...state,
        credentials: { ...state.credentials, avatarUrl: payload },
      };
    }

    case UPDATE_DETAILS: {
      return {
        ...state,
        credentials: { ...state.credentials, ...payload },
      };
    }

    case CLEAR_USER: {
      return {
        ...initialState,
        authenticated: false,
      };
    }

    default:
      return state;
  }
}
