import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//Store
import { connect } from "react-redux";
import {
  markNotifications,
  deleteNotifications,
} from "../store/actions/userActions";

// Date to Time util
import formatDate from "../utils/timeago";

import "../styles/app.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// MUI Components
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  menuButtton: {
    "&:hover": {
      backgroundColor: "inherit",
      color: theme.palette.primary.dark,
    },
  },

  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.light}`,
    padding: "0 4px",
    backgroundColor: theme.palette.background.dark,
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.main,
    [theme.breakpoints.only("xs")]: {
      width: "200px",
    },
    [theme.breakpoints.up("sm")]: {
      width: "300px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "450px",
    },
  },

  title: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    paddingBottom: theme.spacing(1),
    fontWeight: "bold",
    color: theme.palette.primary.dark,
  },

  items: {
    maxHeight: "300px",
    overflowY: "auto",
  },

  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.background.light,
  },

  icon: {
    marginRight: theme.spacing(1),
    fontSize: "22px",
    color: theme.palette.primary.dark,
  },

  sender: {
    color: theme.palette.primary.main,
  },

  date: {
    color: theme.palette.secondary.dark,
  },

  read: {
    color: theme.palette.secondary.main,
  },

  delete: {
    marginLeft: theme.spacing(1),
    fontSize: "16px",
    color: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.background.dark,
    },
  },

  noNew: {
    margin: theme.spacing(2, 4),
  },

  clearAll: {
    borderTop: `2px solid ${theme.palette.secondary.main}`,
    padding: theme.spacing(2, 3, 1, 3),
    background: theme.palette.background.light,
    color: theme.palette.error.main,
  },
}));

const Notifications = ({
  notifications,
  markNotifications,
  deleteNotifications,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e, id, remove) => {
    if ((id, remove)) {
      e.stopPropagation();
      deleteNotifications([id]);
    } else {
      setAnchorEl(null);
      return history.push(`/entry/${id}`);
    }
  };

  const markRead = (e) => {
    setAnchorEl(null);
    markNotifications(
      notifications
        .filter((el) => !el.read)
        .map((el) => ({ ...el, read: true }))
    );
  };

  const clearAll = (e) => {
    deleteNotifications(notifications.map((el) => el.id));
  };

  const close = (e) => {
    if (notifications.some((el) => !el.read)) markRead();
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className={classes.menuButtton}
        color={notifications.length > 0 ? "primary" : "secondary"}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Badge
          classes={{ badge: classes.badge }}
          badgeContent={notifications.filter((el) => !el.read).length}
          color="secondary"
        >
          <FontAwesomeIcon
            icon={
              notifications.some((el) => !el.read) ? "bell" : ["far", "bell"]
            }
          />
        </Badge>
      </IconButton>
      <Menu
        classes={{ paper: classes.menu }}
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        getContentAnchorEl={null}
        TransitionComponent={Zoom}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
      >
        <Typography className={classes.title} align="center">
          Notifications
        </Typography>

        <div className={classes.items}>
          {notifications.length > 0 ? (
            <TransitionGroup>
              {notifications.map((el) => (
                <CSSTransition
                  key={el.id}
                  timeout={200}
                  appear
                  classNames="fade"
                >
                  <MenuItem
                    className={classes.item}
                    onClick={(e) => handleClick(e, el.entryId, false)}
                  >
                    <FontAwesomeIcon
                      className={clsx([classes.icon, el.read && classes.read])}
                      icon={el.type === "like" ? "heart" : "comment"}
                    />
                    <Typography style={{ flexGrow: 1 }} noWrap>
                      <strong
                        className={clsx([
                          classes.sender,
                          el.read && classes.read,
                        ])}
                      >
                        @{el.sender}&nbsp;
                      </strong>
                      <span className={clsx(el.read && classes.read)}>
                        {`${el.type}${
                          el.type === "like" ? "d " : "ed on"
                        } your entry`}
                      </span>
                      <small className={classes.date}>
                        &nbsp;{`(${formatDate(el.createdAt)})`}
                      </small>
                    </Typography>
                    <IconButton
                      className={classes.delete}
                      onClick={(e) => handleClick(e, el.id, true)}
                    >
                      <FontAwesomeIcon icon="trash-alt" />
                    </IconButton>
                  </MenuItem>
                </CSSTransition>
              ))}
            </TransitionGroup>
          ) : (
            <Typography
              className={classes.noNew}
              align="center"
              variant="subtitle1"
            >
              No new notifications
            </Typography>
          )}
        </div>

        <div className={classes.clearAll}>
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            fullWidth
            disabled={notifications.length < 1}
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      </Menu>
    </div>
  );
};

const mapStateToProps = (state) => ({
  notifications: state.user.notifications,
});

const mapActionsToProps = {
  markNotifications,
  deleteNotifications,
};

export default connect(mapStateToProps, mapActionsToProps)(Notifications);
