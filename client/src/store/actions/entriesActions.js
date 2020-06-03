import api from "../../services/api";
import {
  OPEN_MODAL,
  SET_ENTRIES,
  SET_COMMENTS,
  ADD_COMMENT,
  CLOSE_MODAL,
  CLEAR_MODAL,
  UPDATE_LIKES_COUNT,
} from "../types";

export const openModal = (entry) => (dispatch) =>
  dispatch({
    type: OPEN_MODAL,
    payload: entry,
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

export const addComment = (comment) => (dispatch) =>
  dispatch({
    type: ADD_COMMENT,
    payload: comment,
  });

export const updateLikesCount = (count) => (dispatch) =>
  dispatch({
    type: UPDATE_LIKES_COUNT,
    payload: count,
  });

export const clearModal = () => async (dispatch) => {
  await dispatch({
    type: CLOSE_MODAL,
  });

  return setTimeout(
    () =>
      dispatch({
        type: CLEAR_MODAL,
      }),
    100
  );
};
