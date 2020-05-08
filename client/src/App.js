import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

// App Components
import NavBar from "./components/NavBar";

// MUI Components
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

function App() {
  return (
    <div className="App">
      <CssBaseline />
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
      </Router>
    </div>
  );
}

export default App;
