import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Redux Store
import { Provider } from "react-redux";
import store from "./store";

// Middlewares
import AuthRoute from "./middleware/AuthRoute";

// App Theme
import "./styles/app.css";
import { appTheme } from "./theme";

// MUI Components
import {
  ThemeProvider as MuiThemeProvider,
  makeStyles,
} from "@material-ui/core/styles/";

// Font Awesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import icons from "./utils/icons";

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Entry from "./pages/Entry";

// App Components
import { TransitionPage } from "./theme";
import NavBar from "./components/NavBar";
import BottomBar from "./components/BottomBar";

library.add(...icons);

const useStyles = makeStyles((theme) => ({
  app: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "row",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={appTheme}>
      <Provider store={store}>
        <Router>
          <div className={classes.app}>
            <NavBar />

            <Switch>
              <Route path="/" component={TransitionPage(Home)} exact />
              <AuthRoute path="/signin" component={TransitionPage(SignIn)} />
              <AuthRoute path="/signup" component={TransitionPage(SignUp)} />
              <Route
                path="/entry/:id"
                component={TransitionPage(Entry)}
                exact
              />
            </Switch>

            <BottomBar />
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
