import api from "../../services/api";
import {
  ADD_ENTRY,
  ADD_COMMENT,
  SET_ENTRIES,
  SET_ENTRY_DETAILS,
  REMOVE_ENTRY,
  OPEN_ENTRY_NEW,
  CLOSE_ENTRY_NEW,
  UPDATE_LIKES_COUNT,
} from "../types";

export const setEntryDetails = (entry) => (dispatch) =>
  dispatch({
    type: SET_ENTRY_DETAILS,
    payload: entry,
  });

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
