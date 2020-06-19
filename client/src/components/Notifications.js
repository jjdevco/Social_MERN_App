import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

//Store
import { connect } from "react-redux";
import {
  markNotifications,
  deleteNotifications,
} from "../store/actions/userActions";

// Styles
import "../styles/app.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// MUI Components
import clsx from "clsx";
import { fade, makeStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Date to time-string util
import * as timeago from "timeago.js";

const useStyles = makeStyles((theme) => ({
  menuButtton: {
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.light, 0.2),
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
    flexGrow: 1,
    margin: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.background.main,
  },

  title: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    paddingBottom: theme.spacing(1),
    fontWeight: "bold",
    color: theme.palette.primary.dark,
  },

  items: {
    maxHeight: "500px",
    overflowY: "auto",
  },

  item: {
    maxWidth: "350px",
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
  const anchorEl = useRef();

  const [open, setOpen] = useState(false);

  const handleClick = (e, id, remove) => {
    if ((id, remove)) {
      e.stopPropagation();
      deleteNotifications([id]);
    } else {
      setOpen(false);
      return history.push(`/entry/${id}`);
    }
  };

  const markRead = (e) => {
    setOpen(false);
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
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        className={classes.menuButtton}
        color="primary"
        onClick={(e) => setOpen(true)}
      >
        <Badge
          ref={anchorEl}
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
        anchorEl={anchorEl.current}
        open={open}
        onClose={close}
        getContentAnchorEl={null}
        TransitionComponent={Zoom}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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
                        &nbsp;({timeago.format(el.createdAt, "en_EN")})
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

Notifications.propTypes = {
  notifications: PropTypes.array,
  markNotifications: PropTypes.func,
  deleteNotifications: PropTypes.func,
};

export default connect(mapStateToProps, mapActionsToProps)(Notifications);
