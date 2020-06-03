import {
  OPEN_MODAL,
  SET_ENTRIES,
  SET_COMMENTS,
  ADD_COMMENT,
  CLOSE_MODAL,
  CLEAR_MODAL,
  UPDATE_LIKES_COUNT,
} from "../types";

const initialState = {
  modal: false,
  entries: [],
  data: {},
  comments: [],
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_MODAL:
      return {
        ...state,
        modal: true,
        data: payload,
      };

    case SET_ENTRIES: {
      return {
        ...state,
        entries: payload,
      };
    }

    case SET_COMMENTS: {
      return {
        ...state,
        comments: payload,
      };
    }

    case ADD_COMMENT: {
      return {
        ...state,
        data: { ...state.data, commentsCount: state.data.commentsCount + 1 },
        comments: [payload, ...state.comments],
      };
    }

    case CLOSE_MODAL: {
      return {
        ...state,
        modal: false,
      };
    }

    case CLEAR_MODAL: {
      return {
        ...state,
        data: {},
        comments: [],
      };
    }

    case UPDATE_LIKES_COUNT: {
      return {
        ...state,
        data: { ...state.data, likesCount: payload },
      };
    }

    default:
      return state;
  }
}
