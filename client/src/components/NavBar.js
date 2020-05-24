import React, { useState } from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

// MUI Components
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
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
    color: theme.palette.background.contrastText,
  },

  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "56px",
    padding: theme.spacing(0, 1),
    [theme.breakpoints.up("md")]: {
      margin: "0 auto",
      width: "950px",
    },
  },

  leftMenu: {
    display: "flex",
    flexGrow: 1,
    flexWrap: "no-wrap",
  },

  iconButton: {
    height: "16px",
    width: "16px",
    "&:hover": {
      backgroundColor: "inherit",
      color: theme.palette.primary.dark,
    },
  },

  search: {
    display: "flex",
    position: "relative",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "10px",
    backgroundColor: fade(theme.palette.background.dark, 0.6),
    padding: theme.spacing(0, 2),
    margin: theme.spacing(0, 2),
    transition: theme.transitions.create(),
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(1),
    },
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },

  searchActive: {
    flexGrow: 1,
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
    width: "100%",
    [theme.breakpoints.only("sm")]: {
      minWidth: "27ch",
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "40ch",
    },
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

function NavBar(props) {
  const theme = useTheme();
  const classes = useStyles();

  const path = useLocation().pathname;
  const authenticationRoute =
    path === "/signin" || path === "/signup" ? true : false;
  const small = useMediaQuery(theme.breakpoints.up("sm"));

  const [activeSearch, setActiveSearch] = useState(false);

  return (
    <AppBar className={classes.bar}>
      <Toolbar
        variant="dense"
        classes={{
          root: classes.toolbar,
        }}
        disableGutters
      >
        <div className={classes.leftMenu}>
          <IconButton
            className={classes.iconButton}
            component={Link}
            color="primary"
            to="/"
            disableFocusRipple
          >
            <FontAwesomeIcon icon="home" />
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
        {!authenticationRoute && small && (
          <div>
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
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
