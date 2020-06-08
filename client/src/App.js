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
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles/";

// Font Awesome Icons
import { library } from "@fortawesome/fontawesome-svg-core";
import icons from "./utils/icons";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Entry from "./pages/Entry";

// App Components
import Layout from "./layout/Main";
import Entries from "./components/Entries";
import NavBar from "./components/NavBar";
import BottomBar from "./components/BottomBar";

library.add(...icons);

function App() {
  return (
    <MuiThemeProvider theme={appTheme}>
      <Provider store={store}>
        <Router>
          <div
            style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <NavBar />

            <Switch>
              <Route path="/" component={Layout(Entries)} exact />
              <AuthRoute path="/signin" component={Layout(SignIn)} />
              <AuthRoute path="/signup" component={Layout(SignUp)} />
              <Route path="/entry/:id" component={Layout(Entry)} exact />
              <Route path="/user/:username" component={Layout(Entries)} exact />
            </Switch>

            <BottomBar />
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
