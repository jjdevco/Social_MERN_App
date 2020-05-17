import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// CSS styles
import "./styles/app.css";

// MUI Components
import {
  ThemeProvider as MuiThemeProvider,
  makeStyles,
} from "@material-ui/core/styles/";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

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

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#ff6659",
      main: "#d32f2f",
      dark: "#9a0007",
      contrastText: "#fff",
    },
    secondary: {
      light: "#4fb3bf",
      main: "#00838f",
      dark: "#005662",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: "1000px",
    margin: "56px auto 0 auto",
  },
}));

function App() {
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <header>
            <NavBar />
          </header>
          <main className={classes.main}>
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/signin" component={SignIn} />
              <Route path="/signup" component={SignUp} />
            </Switch>
          </main>
          <footer>{small && <BottomBar />}</footer>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
