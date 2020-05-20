import React from "react";
import clsx from "clsx";

// Date to Time util
import formatDate from "../utils/timeago";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

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
    border: `2px solid ${theme.palette.secondary.light}`,
    color: theme.palette.tertiary.contrastText,
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
  },

  username: {
    fontWeight: "bold",
    marginRight: theme.spacing(1),
    "&:hover": {
      textDecoration: "underline",
    },
  },

  date: {
    wordWrap: "no-wrap",
    color: theme.palette.tertiary.dark,
  },

  text: {
    wordWrap: "break-word",
    lineHeight: 1.2,
    letterSpacing: "0.001em",
  },

  last: {
    paddingBottom: theme.spacing(2),
  },
}));

function Comment(props) {
  const classes = useStyles();

  const { username, userAvatar, body, createdAt } = props.data;

  const last = props.last;

  return (
    <Container
      className={clsx([classes.card, last && classes.last])}
      component="div"
      disableGutters
    >
      <div className={classes.avatarContainer}>
        <Divider className={classes.divider} orientation="vertical" flexItem />
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
          <Typography className={classes.username} variant="subtitle1">
            @{username}
          </Typography>
          <Typography className={classes.date} variant="subtitle1">
            - {formatDate(createdAt)}
          </Typography>
        </div>

        <Typography className={classes.text} variant="body1">
          {body}
        </Typography>
      </div>
    </Container>
  );
}

export default Comment;
