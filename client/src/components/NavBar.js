import React, { useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";

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
    borderColor: "lightgray",
    borderStyle: "none none solid none",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },

  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "56px",
    // padding: theme.spacing(0, 2),

    [theme.breakpoints.only("sm")]: {
      margin: "0 auto",
      width: "580px",
    },
    [theme.breakpoints.up("md")]: {
      margin: "0 auto",
      width: "1000px",
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
    },
  },

  search: {
    width: "100%",
    position: "relative",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "10px",
    backgroundColor: fade("#ccc", 0.5),
    padding: theme.spacing(0, 2),
    margin: theme.spacing(0, 2),
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },

  searchActive: {
    borderColor: theme.palette.primary.main,
    backgroundColor: fade("#ccc", 0.2),
  },

  searchIcon: {
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "gray",
  },

  searchIconActive: {
    color: theme.palette.primary.main,
  },

  inputRoot: {
    color: "inherit",
  },

  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.only("sm")]: {
      width: "25ch",
      "&:focus": {
        width: "43ch",
      },
    },
    [theme.breakpoints.up("md")]: {
      width: "34ch",
      "&:focus": {
        width: "52ch",
      },
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
  const [activeSearch, setActiveSearch] = useState(false);
  const medium = useMediaQuery(theme.breakpoints.up("md"));

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
        {medium && (
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
