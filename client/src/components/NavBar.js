import React, { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

// Store
import { connect } from "react-redux";
import { checkAuth } from "../store/actions/userActions";
import { openEntryNew } from "../store/actions/entriesActions";

// Api
import api from "../services/api";

// APP Components
import New from "./New";
import Notifications from "./Notifications";
import Profile from "./Profile";

// MUI Components
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import InputAdornment from "@material-ui/core/InputAdornment";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography, CircularProgress } from "@material-ui/core";

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
    width: "inherit",
    color: "inherit",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(2)}px)`,
  },

  eraseIcon: {
    color: theme.palette.error.main,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.error.dark,
    },
  },

  menu: {
    width: "inherit",
  },

  menuSearchBtn: {
    borderBottom: `5px solid ${theme.palette.secondary.light}`,
  },

  menuItem: {
    borderTop: `1px solid ${theme.palette.secondary.light}`,
  },

  menuItemAvatar: {
    marginRight: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.light}`,
  },

  loadingResults: {
    display: "flex",
    minHeight: "150px",
    margin: "auto",
  },

  buttons: {
    display: "flex",
    flexDirection: "row",
    marginRight: theme.spacing(1),
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    width: "250px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[5],
    borderRadius: "10px",
    backgroundColor: theme.palette.background.light,
  },

  divider: {
    width: "inherit",
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },

  closeButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    transition: theme.transitions.create(),
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

function NavBar({ authenticated, checkAuth, openEntryNew }) {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const pathname = history.location.pathname;

  const [search, setSearch] = useState("");
  const [loadingResults, setLoadingResults] = useState(false);
  const [results, setResults] = useState([]);
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [activeSearch, setActiveSearch] = useState(false);
  const [path, setPath] = useState(pathname);
  const [profile, setProfile] = useState(false);

  const small = useMediaQuery(theme.breakpoints.down(1000));

  const menuRef = useRef(null);

  const handleNavigation = (e) => {
    return path !== "/" ? history.goBack() : window.location.reload(false);
  };

  const handleGo = (username) => {
    setOpenSearchBox(false);
    history.push(`/user/${username}`);
  };

  const handleSearch = useCallback(() => {
    if (search.length > 0) {
      setLoadingResults(true);
      setOpenSearchBox(true);
      return api.user.searchUsers(search).then(({ data }) => {
        setResults(data);
        setLoadingResults(false);
      });
    } else {
      setOpenSearchBox(false);
      setLoadingResults(false);
    }
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [search, handleSearch]);

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
            onClick={handleNavigation}
          >
            <FontAwesomeIcon icon={path !== "/" ? "arrow-left" : "home"} />
          </IconButton>
          <div
            ref={menuRef}
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
              value={search}
              onFocus={() => setActiveSearch(true)}
              onBlur={() => setActiveSearch(false)}
              onChange={(e) => setSearch(e.target.value)}
              endAdornment={
                search.length > 0 ? (
                  <InputAdornment position="end">
                    <FontAwesomeIcon
                      className={classes.eraseIcon}
                      icon="times"
                      onClick={() => setSearch("")}
                    />
                  </InputAdornment>
                ) : (
                  ""
                )
              }
            />
            <Popper
              open={openSearchBox && search.length > 0}
              anchorEl={menuRef.current}
              role={undefined}
              transition
              disablePortal
              className={classes.menu}
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: "left 75",
                  }}
                  timeout={{ appear: 500, enter: 500, exit: 0 }}
                >
                  <Paper elevation={3}>
                    <ClickAwayListener
                      onClickAway={() => setOpenSearchBox(false)}
                    >
                      {loadingResults ? (
                        <CircularProgress
                          className={classes.loadingResults}
                          color="primary"
                        />
                      ) : (
                        <MenuList style={{ padding: 0 }}>
                          <MenuItem
                            className={classes.menuSearchBtn}
                            onClick={(e) => handleGo(search)}
                          >
                            Go to <strong>&nbsp;@{search}</strong>
                          </MenuItem>
                          {results.map(({ avatar, username }) => (
                            <Fade in={!!username} key={username}>
                              <MenuItem
                                className={classes.menuItem}
                                onClick={(e) => handleGo(username)}
                              >
                                <Avatar
                                  className={classes.menuItemAvatar}
                                  aria-label="avatar"
                                  alt="avatar"
                                  src={avatar}
                                >
                                  {username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography>
                                  <strong>@</strong>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: username.replace(
                                        search,
                                        "<strong>" + search + "</strong>"
                                      ),
                                    }}
                                  ></span>
                                </Typography>
                              </MenuItem>
                            </Fade>
                          ))}
                        </MenuList>
                      )}
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
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

            {small && (
              <IconButton
                className={classes.iconButton}
                color="primary"
                onClick={() => setProfile(true)}
              >
                <FontAwesomeIcon icon={"user-circle"} />
              </IconButton>
            )}
          </div>
        )}
        {authenticated && <New />}{" "}
        {authenticated && small && (
          <Modal
            className={classes.modal}
            open={profile}
            onClose={() => setProfile(false)}
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 300,
            }}
            closeAfterTransition
            disableAutoFocus
            disableEnforceFocus
          >
            <Fade in={profile}>
              <div className={classes.paper}>
                <Profile small={small} />
                <div className={classes.divider}></div>
                <Button
                  className={classes.closeButton}
                  variant="contained"
                  onClick={() => setProfile(false)}
                >
                  Close
                </Button>
              </div>
            </Fade>
          </Modal>
        )}
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
