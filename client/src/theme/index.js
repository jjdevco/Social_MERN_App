import React from "react";

import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { makeStyles } from "@material-ui/core/styles/";
import CSSTransition from "react-transition-group/CSSTransition";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexGrow: 1,
    maxWidth: "1000px",
    margin: "56px auto 0 auto",
  },
}));

export const appTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fb3bf",
      main: "#00838f",
      dark: "#005662",
      contrastText: "#fff",
    },
    secondary: {
      light: "#cfd8dc",
      main: "#90a4ae",
      dark: "#607d8b",
      contrastText: "#000",
    },
    background: {
      light: "#fff",
      main: "#f0f0f0",
      dark: "#dcdcdc",
      contrastText: "#000",
    },
    error: {
      light: "#ff6659",
      main: "#d32f2f",
      dark: "#9a0007",
    },
  },
});

export const TransitionPage = (Page, previous) => {
  const classes = useStyles();
  return (props) => (
    <CSSTransition
      in={true}
      appear={true}
      timeout={600}
      classNames="fade"
      unmountOnExit
    >
      <main className={classes.main}>
        <Page {...props} />
      </main>
    </CSSTransition>
  );
};
