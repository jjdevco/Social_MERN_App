import React from "react";

//MUI Components
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, useTheme } from "@material-ui/core/styles/";
import CSSTransition from "react-transition-group/CSSTransition";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  main: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
    marginTop: theme.spacing(7),
    marginLeft: "auto",
    marginRight: "auto",
  },

  view: {
    display: "flex",
    maxWidth: "700px",
    margin: 0,
    padding: theme.spacing(0, 1),
  },

  sideContent: {
    display: "flex",
    flexShrink: 1,
    padding: theme.spacing(2, 1),
  },

  bottom: {
    marginBottom: theme.spacing(7),
  },
}));

export default function Layout(Page, previous) {
  const classes = useStyles();
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down(1000));

  return (props) => {
    const path = props.location.pathname;

    const authenticationRoute =
      path === "/signin" || path === "/signup" ? true : false;

    return (
      <main className={classes.main}>
        <Container
          className={clsx([
            classes.view,
            small && !authenticationRoute && classes.bottom,
          ])}
          disableGutters
        >
          <CSSTransition
            in={true}
            appear={true}
            timeout={600}
            classNames="fade"
          >
            <Page {...props} />
          </CSSTransition>
        </Container>

        {!small && !authenticationRoute && (
          <div className={classes.sideContent}>
            <div style={{ width: "300px" }}>profile</div>
          </div>
        )}
      </main>
    );
  };
}
