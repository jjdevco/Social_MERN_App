import React from "react";
import PropTypes from "prop-types";

// Router
import { useLocation } from "react-router-dom";

//Store
import { connect } from "react-redux";

//App components
import AuthenticationCard from "./AuthenticationCard";
import Profile from "./Profile";

//Mui Components
import { makeStyles } from "@material-ui/core/styles";

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
    boxShadow: theme.shadows[3],
    transition: theme.transitions.create(),
  },
}));

function SideContent({ authenticated }) {
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

SideContent.propTypes = {
  authenticated: PropTypes.bool,
};

export default connect(mapStateToProps)(SideContent);
