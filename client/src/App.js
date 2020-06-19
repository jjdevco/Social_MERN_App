import React from "react";

// Router
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//  Store
import { Provider } from "react-redux";
import store from "./store";

// Middlewares
import AuthRoute from "./middleware/AuthRoute";

// App Theme
import "./styles/app.css";
import { appTheme } from "./theme";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// App Components
import FourZeroFour from "./components/FourZeroFour";
import Cards from "./components/Cards";
import FullCard from "./components/FullCard";
import NavBar from "./components/NavBar";
import BottomBar from "./components/BottomBar";
import SideContent from "./components/SideContent";
import TransitionerPage from "./components/TransitionerPage";

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
                  <Route path="/" component={TransitionerPage(Cards)} exact />
                  <Route
                    path="/user/:username"
                    component={TransitionerPage(Cards)}
                    exact
                  />
                  <Route
                    path="/entry/:id"
                    component={TransitionerPage(FullCard)}
                    exact
                  />
                  <AuthRoute
                    path="/signin"
                    component={TransitionerPage(SignIn)}
                  />
                  <AuthRoute
                    path="/signup"
                    component={TransitionerPage(SignUp)}
                  />
                  <Route path="*">
                    <FourZeroFour />
                  </Route>
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
