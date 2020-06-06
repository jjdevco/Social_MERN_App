import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Reducers
import userReducer from "./reducers/userReducer";
import entriesReducer from "./reducers/entriesReducer";

const devTools =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
    : null;

const middleware = [thunk];
const initialState = {};

const reducers = combineReducers({
  user: userReducer,
  entries: entriesReducer,
});

const store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(...middleware), devTools)
);

export default store;
