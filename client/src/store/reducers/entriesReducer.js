import {
  ADD_ENTRY,
  ADD_COMMENT,
  SET_ENTRIES,
  SET_COMMENTS,
  REMOVE_ENTRY,
  OPEN_ENTRY_NEW,
  CLOSE_ENTRY_NEW,
  OPEN_ENTRY_REMOVE,
  CLOSE_ENTRY_REMOVE,
  OPEN_ENTRY_DETAILS,
  CLOSE_ENTRY_DETAILS,
  CLEAR_ENTRY_DETAILS,
  UPDATE_LIKES_COUNT,
} from "../types";

const initialState = {
  entryNew: false,
  entryDetails: false,
  entries: [],
  entry: {},
  toRemove: null,
  comments: [],
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case ADD_ENTRY: {
      return {
        ...state,
        entries: [payload, ...state.entries],
      };
    }

    case ADD_COMMENT: {
      return {
        ...state,
        entry: { ...state.entry, commentsCount: state.entry.commentsCount + 1 },
        comments: [payload, ...state.comments],
      };
    }

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

    case REMOVE_ENTRY: {
      return {
        ...state,
        entries: [
          ...state.entries.filter((entry) =>
            entry.id !== payload ? entry : null
          ),
        ],
      };
    }

    case OPEN_ENTRY_NEW:
      return {
        ...state,
        entryNew: true,
      };

    case CLOSE_ENTRY_NEW:
      return {
        ...state,
        entryNew: false,
      };

    case OPEN_ENTRY_REMOVE:
      return {
        ...state,
        toRemove: payload,
      };

    case CLOSE_ENTRY_REMOVE:
      return {
        ...state,
        toRemove: null,
      };

    case OPEN_ENTRY_DETAILS:
      return {
        ...state,
        entryDetails: true,
        entry: payload,
      };

    case CLOSE_ENTRY_DETAILS: {
      return {
        ...state,
        entryDetails: false,
      };
    }

    case CLEAR_ENTRY_DETAILS: {
      return {
        ...state,
        entry: {},
        comments: [],
      };
    }

    case UPDATE_LIKES_COUNT: {
      return {
        ...state,
        entry: { ...state.entry, likesCount: payload },
      };
    }

    default:
      return state;
  }
}
