import {
  ADD_ENTRY,
  ADD_COMMENT,
  SET_ENTRIES,
  SET_ENTRY,
  REMOVE_ENTRY,
  OPEN_ENTRY_NEW,
  CLOSE_ENTRY_NEW,
  UPDATE_LIKES_COUNT,
} from "../types";

const initialState = {
  entryNew: false,
  entries: [],
  entry: {},
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
        entry: {
          ...state.entry,
          commentsCount: state.entry.commentsCount + 1,
          comments: [payload, ...state.entry.comments],
        },
      };
    }

    case SET_ENTRIES: {
      return {
        ...state,
        entries: payload,
      };
    }

    case SET_ENTRY:
      return {
        ...state,
        entry: payload,
      };

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
