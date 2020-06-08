import React from "react";

//MUI Components
import { makeStyles } from "@material-ui/core/styles/";
import CSSTransition from "react-transition-group/CSSTransition";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    maxWidth: "1000px",
    marginTop: theme.spacing(7),
    marginLeft: "auto",
    marginRight: "auto",
  },

  view: {
    display: "flex",
    flexGrow: 1,
    margin: theme.spacing(1),
    [theme.breakpoints.only("xs")]: {
      width: "100%",
    },
  },

  sideContent: {
    display: "flex",
    flexShrink: 1,
    padding: theme.spacing(2, 1),
    [theme.breakpoints.down(750)]: {
      display: "none",
    },
  },

  bottom: {
    [theme.breakpoints.only("xs")]: {
      marginBottom: "56px",
    },
  },
}));

export default function Layout(Page, previous) {
  const classes = useStyles();
  return (props) => (
    <main className={classes.main}>
      <Container className={classes.view} disableGutters>
        <CSSTransition
          in={true}
          appear={true}
          timeout={600}
          classNames="fade"
          unmountOnExit
        >
          <Page {...props} />
        </CSSTransition>
      </Container>

      <div className={classes.sideContent} disableGutters>
        profile
      </div>
    </main>
  );
}
