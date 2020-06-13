import React from "react";
import PropTypes from "prop-types";

// Router
import { Link, useLocation } from "react-router-dom";

// Store
import { connect } from "react-redux";

// MUI Components
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  spacer: { height: theme.spacing(7) },

  appBar: {
    display: "flex",
    top: "auto",
    bottom: 0,
    backgroundColor: theme.palette.background.light,
  },

  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "55px",
    width: "100%",
    minWidth: "210px",
    [theme.breakpoints.up("sm")]: {
      margin: "0 auto",
      width: "600px",
    },
  },

  button: {
    display: "flex",
    flexGrow: 1,
    margin: theme.spacing(0, 1),
    borderRadius: "15px",
    borderWidth: "2px",
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": {
      borderWidth: "2px",
    },
  },
}));

function BottomBar({ authenticated }) {
  const theme = useTheme();
  const classes = useStyles();
  const path = useLocation().pathname;
  const small = useMediaQuery(theme.breakpoints.down(1000));
  const authenticationRoute =
    path === "/signin" || path === "/signup" ? true : false;

  return !authenticated && !authenticationRoute && small ? (
    <div className={classes.spacer}>
      <AppBar
        color="transparent"
        classes={{
          root: classes.appBar,
        }}
      >
        <Toolbar
          variant="dense"
          classes={{
            root: classes.toolbar,
          }}
          disableGutters
        >
          <Button
            className={classes.button}
            color="primary"
            variant="outlined"
            component={Link}
            to="/signin"
          >
            Sign In
          </Button>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            size="medium"
            component={Link}
            to="/signup"
            disableElevation
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  ) : (
    ""
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

BottomBar.propTypes = {
  authenticated: PropTypes.bool,
};

export default connect(mapStateToProps)(BottomBar);
