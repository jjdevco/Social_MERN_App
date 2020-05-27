import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// App Theme
import { appTheme, TransitionPage } from "./theme";

// CSS styles
import "./styles/app.css";

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

// App Components
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
      <Router>
        <div className={classes.app}>
          <NavBar />

          <Switch>
            <Route path="/" component={TransitionPage(Home)} exact />
            <Route path="/signin" component={TransitionPage(SignIn)} />
            <Route path="/signup" component={TransitionPage(SignUp)} />
          </Switch>

          <BottomBar />
        </div>
      </Router>
    </MuiThemeProvider>
  );
}

export default App;
