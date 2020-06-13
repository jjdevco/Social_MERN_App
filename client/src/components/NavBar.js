import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

// Store
import { connect } from "react-redux";
import { checkAuth } from "../store/actions/userActions";
import { openEntryNew } from "../store/actions/entriesActions";

// APP Components
import New from "./New";
import Notifications from "./Notifications";

// MUI Components
import clsx from "clsx";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  bar: {
    borderWidth: "1px",
    borderColor: theme.palette.secondary.main,
    borderStyle: "none none solid none",
    backgroundColor: theme.palette.background.light,
  },

  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(0.5, 0),
    margin: theme.spacing(0, 1),
  },

  left: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    maxWidth: "650px",
  },

  iconButton: {
    width: "48px",
    transition: theme.transitions.create(),
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.light, 0.2),
      color: theme.palette.primary.dark,
    },
  },

  search: {
    display: "flex",
    width: "100%",
    maxWidth: "550px",
    position: "relative",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "10px",
    margin: theme.spacing(0.5, 1),
    padding: theme.spacing(0, 2),
    color: theme.palette.background.contrastText,
    backgroundColor: fade(theme.palette.background.dark, 0.6),
    transition: theme.transitions.create(),
  },

  searchActive: {
    borderColor: theme.palette.primary.main,
    backgroundColor: fade(theme.palette.background.dark, 0.3),
  },

  searchIcon: {
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.primary.dark,
  },

  searchIconActive: {
    color: theme.palette.primary.main,
  },

  inputRoot: {
    color: "inherit",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    marginRight: theme.spacing(1),
  },
}));

function NavBar({ authenticated, checkAuth, openEntryNew }) {
  const classes = useStyles();
  const history = useHistory();
  const pathname = history.location.pathname;

  const [activeSearch, setActiveSearch] = useState(false);
  const [path, setPath] = useState(pathname);

  const handleGo = (e) => {
    return path !== "/" ? history.goBack() : window.location.reload(false);
  };

  useEffect(() => {
    checkAuth();
    setPath(pathname);
  }, [pathname, checkAuth]);

  return (
    <AppBar classes={{ root: classes.bar }}>
      <Toolbar
        variant="dense"
        classes={{
          root: classes.toolbar,
        }}
        disableGutters
      >
        <div className={classes.left}>
          <IconButton
            className={classes.iconButton}
            color="primary"
            onClick={handleGo}
          >
            <FontAwesomeIcon icon={path !== "/" ? "arrow-left" : "home"} />
          </IconButton>
          <div
            className={clsx([
              classes.search,
              activeSearch && classes.searchActive,
            ])}
          >
            <div className={classes.searchIcon}>
              <FontAwesomeIcon
                className={clsx(activeSearch && classes.searchIconActive)}
                icon="search"
              />
            </div>
            <InputBase
              placeholder="Search"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onFocus={() => setActiveSearch(true)}
              onBlur={() => setActiveSearch(false)}
            />
          </div>
        </div>
        {authenticated && (
          <div className={classes.buttons}>
            <IconButton
              className={classes.iconButton}
              color="primary"
              onClick={() => openEntryNew()}
            >
              <FontAwesomeIcon icon="plus" />
            </IconButton>
            <Notifications />
          </div>
        )}

        {authenticated && <New />}
      </Toolbar>
    </AppBar>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  credentials: !!state.user.credentials,
});

const mapActionsToProps = {
  checkAuth,
  openEntryNew,
};

NavBar.propTypes = {
  authenticated: PropTypes.bool,
  checkAuth: PropTypes.func,
  openEntryNew: PropTypes.func,
};

export default connect(mapStateToProps, mapActionsToProps)(NavBar);
