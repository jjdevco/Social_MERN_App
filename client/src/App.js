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
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  ThemeProvider as MuiThemeProvider,
  makeStyles,
  useTheme,
} from "@material-ui/core/styles/";

// Font Awesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import icons from "./utils/icons";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Entry from "./pages/Entry";

// App Components
import Entries from "./components/Entries";
import NavBar from "./components/NavBar";
import BottomBar from "./components/BottomBar";
import SideContent from "./components/SideContent";
import TransitionerPage from "./components/TransitionerPage";

library.add(...icons);

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "row",
  },

  main: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
    marginTop: theme.spacing(7),
  },

  route: {
    display: "flex",
    maxWidth: "700px",
    width: "100%",
    margin: 0,
    padding: theme.spacing(0, 1),
  },
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down(1000));

  return (
    <MuiThemeProvider theme={appTheme}>
      <Provider store={store}>
        <Router>
          <NavBar />
          <div className={classes.container}>
            <main className={classes.main}>
              <div className={classes.route}>
                <Switch>
                  <Route path="/" component={TransitionerPage(Entries)} exact />
                  <AuthRoute
                    path="/signin"
                    component={TransitionerPage(SignIn)}
                  />
                  <AuthRoute
                    path="/signup"
                    component={TransitionerPage(SignUp)}
                  />
                  <Route
                    path="/entry/:id"
                    component={TransitionerPage(Entry)}
                    exact
                  />
                  <Route
                    path="/user/:username"
                    component={TransitionerPage(Entries)}
                    exact
                  />
                </Switch>
              </div>

              {!small && <SideContent />}
            </main>
          </div>
          <BottomBar />
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
