import React from "react";
import { useHistory } from "react-router-dom";

// Date to Time util
import formatDate from "../utils/timeago";

// MUI Components
import clsx from "clsx";
import { fade, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

// APP Components
import Media from "./Media";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
    borderColor: theme.palette.secondary.main,
    borderWidth: "3px",
    borderStyle: "solid",
    borderRadius: "5px",
    boxShadow: theme.shadows[3],
    transition: theme.transitions.create(),
    "&:hover": {
      backgroundColor: fade(theme.palette.background.main, 0.35),
      borderColor: theme.palette.primary.main,
    },
  },

  card: {
    display: "flex",
    cursor: "pointer",
    paddingRight: theme.spacing(2),
  },

  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "90px",
  },

  avatar: {
    width: "50px",
    height: "50px",
    margin: theme.spacing(1.5, 2),
    border: `2px solid ${theme.palette.primary.light}`,
    color: theme.palette.primary.contrastText,
  },

  divider: { flexGrow: 1, margin: "auto", width: "3px" },

  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  },

  username: {
    marginTop: theme.spacing(1),
    fontWeight: "bold",
    color: theme.palette.primary.main,
    "&:hover": {
      textDecoration: "underline",
    },
  },

  date: {
    color: theme.palette.primary.light,
    fontWeight: "bold",
    wordWrap: "no-wrap",
  },

  text: {
    flexGrow: 1,
    margin: theme.spacing(1, 0, 2, 0),
    wordWrap: "break-word",
    lineHeight: 1.2,
    letterSpacing: "0.001em",
  },

  mediaContainer: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },

  media: {
    margin: theme.spacing(2, 0, 2, 2),
    width: "150px",
    maxHeight: "150px",
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[5],
    borderRadius: "6px",
  },

  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
    padding: theme.spacing(0, 3),
    color: theme.palette.primary.main,
    borderTop: `solid 1px ${theme.palette.background.dark}`,
    backgroundColor: theme.palette.background.main,
  },

  actionContainer: {
    display: "flex",
    flexWrap: "no-wrap",
    alignItems: "center",
  },

  actionIcon: {
    padding: theme.spacing(1),
    marginRight: "2px",
    fontSize: "20px",
    color: theme.palette.primary.main,
    "&:hover": {
      background: "none",
      color: theme.palette.primary.dark,
    },
  },
}));

function Card({ openEntryDetails, openEntryRemove, ...props }) {
  const classes = useStyles();
  const history = useHistory();
  const {
    id,
    username,
    userAvatar,
    body,
    commentsCount,
    likesCount,
    media,
    createdAt,
  } = props.data;

  const toProfile = (e) => {
    e.stopPropagation();
    return history.push(`/user/${username}`);
  };

  return (
    <Container className={classes.root} component="div" disableGutters>
      <Container
        className={classes.card}
        component="div"
        disableGutters
        onClick={() => history.push(`/entry/${id}`)}
      >
        <div className={classes.avatarContainer}>
          <Avatar
            className={classes.avatar}
            aria-label="avatar"
            alt="avatar"
            src={userAvatar}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>

          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
        </div>
        <div className={classes.content}>
          <div className={classes.header}>
            <Typography
              className={classes.username}
              variant="h6"
              onClick={toProfile}
            >
              @{username}
            </Typography>
          </div>

          <Typography className={classes.date} variant="body2">
            {formatDate(createdAt)}
          </Typography>

          <Typography
            className={clsx([classes.text, !media && classes.noMedia])}
            variant="body1"
          >
            {body}
          </Typography>
        </div>
        {media && (
          <div className={classes.mediaContainer}>
            <div className={classes.media}>
              <Media src={media} height={150} />
            </div>
          </div>
        )}
      </Container>

      <div className={classes.actions}>
        <div className={classes.actionContainer}>
          <FontAwesomeIcon
            icon={commentsCount > 0 ? "comments" : ["far", "comments"]}
          />
          &nbsp;
          <Typography variant="caption">
            {commentsCount} {commentsCount !== 1 ? "Comments" : "Comment"}
          </Typography>
        </div>

        <div className={classes.actionContainer}>
          <FontAwesomeIcon icon={likesCount > 0 ? "heart" : ["far", "heart"]} />
          &nbsp;
          <Typography variant="caption">
            {likesCount} {`${likesCount !== 1 ? "Likes" : "Like"}`}
          </Typography>
        </div>

        <IconButton className={classes.actionIcon} aria-label="share">
          <FontAwesomeIcon icon="share" />
        </IconButton>
      </div>
    </Container>
  );
}

export default Card;
