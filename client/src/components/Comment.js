import React from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

// MUI Components
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

// Date to time-string util
import * as timeago from "timeago.js";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "row",
    cursor: "default",
    "&:hover": {
      backgroundColor: theme.palette.background.main,
    },
  },

  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  avatar: {
    width: "50px",
    height: "50px",
    margin: theme.spacing(1, 2),
    border: `2px solid ${theme.palette.primary.light}`,
    color: theme.palette.primary.contrastText,
  },

  divider: { flexGrow: 0, margin: "auto", minHeight: "10px", width: "3px" },

  dividerBottom: { flexGrow: 1 },

  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    padding: theme.spacing(2, 2, 1, 1),
    maxWidth: "900px",
  },

  header: {
    display: "flex",
    alignItems: "center",
  },

  username: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  date: {
    color: theme.palette.primary.dark,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  text: {
    wordWrap: "break-word",
    lineHeight: 1.2,
    letterSpacing: "0.001em",
    marginRight: theme.spacing(2),
  },

  first: {
    paddingTop: theme.spacing(1),
  },

  last: {
    paddingBottom: theme.spacing(1),
  },
}));

function Comment({ first, last, username, userAvatar, body, createdAt }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Container
      className={clsx([classes.card, last && classes.last])}
      component="div"
      disableGutters
    >
      <div className={clsx(classes.avatarContainer, first && classes.first)}>
        {!first && (
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
        )}
        <Avatar
          className={classes.avatar}
          aria-label="avatar"
          alt="avatar"
          src={userAvatar}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>
        {!last && (
          <Divider
            className={clsx([classes.divider, classes.dividerBottom])}
            orientation="vertical"
            flexItem
          />
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.header}>
          <Typography
            className={classes.username}
            variant="subtitle1"
            onClick={() => history.push(`/user/${username}`)}
          >
            @{username}
          </Typography>

          <Typography className={classes.date} variant="caption">
            - {timeago.format(createdAt, "en_EN")}
          </Typography>
        </div>

        <Typography className={classes.text} align="left" variant="body1">
          {body}
        </Typography>
      </div>
    </Container>
  );
}

Comment.propTypes = {
  first: PropTypes.bool,
  last: PropTypes.bool,
  username: PropTypes.string,
  userAvatar: PropTypes.string,
  body: PropTypes.string,
  createdAt: PropTypes.string,
};

export default Comment;
