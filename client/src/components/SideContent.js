import React from "react";
import { useLocation } from "react-router-dom";

//Store
import { connect } from "react-redux";

//Mui Components
import { makeStyles } from "@material-ui/core/styles";

//App components
import AuthenticationCard from "./AuthenticationCard";
import Profile from "./Profile";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "250px",
    margin: theme.spacing(2, 1),
  },

  container: {
    position: "fixed",
    width: "inherit",
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: "5px",
    transition: theme.transitions.create(),
  },
}));

function SideContent({ authenticated, ...props }) {
  const classes = useStyles();

  const path = useLocation().pathname;
  const authenticationRoute =
    path === "/signin" || path === "/signup" ? true : false;

  return !authenticationRoute ? (
    <div className={classes.root}>
      <div className={classes.container}>
        {!authenticated ? <AuthenticationCard /> : <Profile />}
      </div>
    </div>
  ) : (
    ""
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(SideContent);
