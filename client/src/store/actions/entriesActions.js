import api from "../../services/api";
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

export const addEntry = (entry) => async (dispatch) => {
  await dispatch({
    type: ADD_ENTRY,
    payload: entry,
  });

  return dispatch({
    type: CLOSE_ENTRY_NEW,
  });
};

export const addComment = (comment) => (dispatch) =>
  dispatch({
    type: ADD_COMMENT,
    payload: comment,
  });

export const getEntries = () => async (dispatch) =>
  await api.entries
    .getAll()
    .then(({ data }) => dispatch({ type: SET_ENTRIES, payload: data }))
    .catch((err) => console.log(err));

export const getComments = (id) => async (dispatch) =>
  await api.entries
    .getComments(id)
    .then(({ data }) => dispatch({ type: SET_COMMENTS, payload: data }))
    .catch((err) => console.log(err));

export const removeEntry = (entry) => (dispatch) =>
  dispatch({
    type: REMOVE_ENTRY,
    payload: entry,
  });

export const updateLikesCount = (count) => (dispatch) =>
  dispatch({
    type: UPDATE_LIKES_COUNT,
    payload: count,
  });

export const openEntryNew = () => (dispatch) =>
  dispatch({
    type: OPEN_ENTRY_NEW,
  });

export const closeEntryNew = () => (dispatch) =>
  dispatch({
    type: CLOSE_ENTRY_NEW,
  });

export const openEntryRemove = (id) => (dispatch) =>
  dispatch({
    type: OPEN_ENTRY_REMOVE,
    payload: id,
  });

export const closeEntryRemove = () => (dispatch) =>
  dispatch({
    type: CLOSE_ENTRY_REMOVE,
  });

export const openEntryDetails = (entry) => (dispatch) =>
  dispatch({
    type: OPEN_ENTRY_DETAILS,
    payload: entry,
  });

export const closeEntryDetails = () => async (dispatch) => {
  await dispatch({
    type: CLOSE_ENTRY_DETAILS,
  });

  return setTimeout(
    () =>
      dispatch({
        type: CLEAR_ENTRY_DETAILS,
      }),
    100
  );
};
