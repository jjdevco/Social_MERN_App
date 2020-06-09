import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

//Store
import { connect } from "react-redux";
import { checkAuth } from "../store/actions/userActions";
import { openEntryNew } from "../store/actions/entriesActions";

// MUI Components
import clsx from "clsx";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";

//APP Components
import New from "./New";
import Notifications from "./Notifications";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  bar: {
    borderWidth: "1px",
    borderColor: theme.palette.secondary.main,
    borderStyle: "none none solid none",
    backgroundColor: theme.palette.background.light,
    color: theme.palette.background.contrastText,
  },

  toolbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    [theme.breakpoints.down(1000)]: {
      maxWidth: "700px",
    },
  },

  left: {
    height: "56px",
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    maxWidth: "650px",
    marginLeft: theme.spacing(1),
  },

  iconButton: {
    width: "40px",
    height: "40px",
    margin: "auto 0",
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
    margin: theme.spacing(1, 2, 1, 1),
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "10px",
    padding: theme.spacing(0, 2),
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

  button: {
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

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function NavBar({
  authenticated,
  credentials,
  initialize,
  checkAuth,
  openEntryNew,
  location,
  ...props
}) {
  const classes = useStyles();
  const history = useHistory();
  const pathname = history.location.pathname;

  const [activeSearch, setActiveSearch] = useState(false);
  const [path, setPath] = useState(pathname);

  const prevPath = usePrevious(path);

  const handleGo = (e) => {
    return path !== "/" ? history.goBack() : window.location.reload(false);
  };

  useEffect(() => {
    checkAuth();
    setPath(pathname);
  }, [pathname, checkAuth]);

  return (
    <AppBar className={classes.bar}>
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
            <FontAwesomeIcon
              icon={!!prevPath && path !== "/" ? "arrow-left" : "home"}
            />
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

export default connect(mapStateToProps, mapActionsToProps)(NavBar);
