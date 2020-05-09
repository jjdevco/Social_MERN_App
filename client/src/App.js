import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// App Components
import NavBar from "./components/NavBar";
import BottomBar from "./components/BottomBar";

// MUI Components
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles/";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Container from "@material-ui/core/Container";

// Font Awesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import icons from "./utils/icons";

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

function App() {
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <header>
            <NavBar />
          </header>
          <main>
            <Container style={{ marginTop: "64px" }}>
              <Switch>
                <Route path="/" component={Home} exact />
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
              </Switch>
            </Container>
          </main>
          <footer>{small && <BottomBar />}</footer>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
