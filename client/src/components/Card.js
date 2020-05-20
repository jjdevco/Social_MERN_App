import React, { useState } from "react";
import { Link } from "react-router-dom";

// Api Services
import api from "../services/api";

// Date to Time util
import formatDate from "../utils/timeago";

// MUI Components
import { fade, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// APP Components
import Media from "./Media";
import Comment from "./Comment";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  root: {
    borderColor: theme.palette.tertiary.main,
    borderWidth: "5px",
    borderStyle: "solid none solid none",
    cursor: "pointer",
  },

  card: {
    display: "flex",
    flexDirection: "row",
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
    margin: theme.spacing(2, 2, 1, 2),
    border: `2px solid ${theme.palette.secondary.light}`,
    color: theme.palette.tertiary.contrastText,
  },

  divider: { flexGrow: 1, margin: "auto", width: "3px" },

  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
    margin: theme.spacing(0.5, 0),
    wordWrap: "break-word",
    lineHeight: 1.2,
    letterSpacing: "0.001em",
  },

  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(1),
    color: theme.palette.secondary.main,
  },

  actionIcon: {
    padding: theme.spacing(1),
    marginRight: "2px",
    fontSize: "20px",
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: fade(theme.palette.secondary.main, 0.2),
      color: theme.palette.secondary.dark,
    },
  },

  showComments: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(1, 0),
    "&:hover": {
      backgroundColor: theme.palette.background.main,
    },
  },

  showCommentsIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "15px",
    minWidth: "86px",
    color: theme.palette.tertiary.main,
  },

  showCommentsText: {
    margin: theme.spacing(0, 1),
    color: theme.palette.secondary.main,
  },

  commentsLoading: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexGrow: 1,
  },

  comments: {
    display: "flex",
    flexDirection: "column",
  },
}));

function Card(props) {
  const classes = useStyles();

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

  const [commentsFetched, setCommentsFetched] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = (id) => {
    setLoadingComments(true);
    api
      .getEntryComments(id)
      .then((comments) => {
        setCommentsFetched(comments.data);
        setLoadingComments(false);
      })
      .catch((err) => {
        alert(err);
        setLoadingComments(false);
      });
  };

  const comments = commentsFetched
    ? commentsFetched.map((comment, index) => (
        <Comment
          key={index}
          data={comment}
          last={index === commentsFetched.length - 1}
        />
      ))
    : commentsFetched;

  return (
    <Container className={classes.root} component="div" disableGutters>
      <Container className={classes.card} component="div" disableGutters>
        <div className={classes.avatarContainer}>
          <Avatar
            className={classes.avatar}
            aria-label="avatar"
            alt="avatar"
            src={userAvatar}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
          {commentsCount > 0 && (
            <Divider
              className={classes.divider}
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

          {media && <Media src={media} />}

          <div className={classes.actions}>
            <div>
              <IconButton className={classes.actionIcon} aria-label="comment">
                <FontAwesomeIcon icon={["far", "comment"]} />
              </IconButton>

              {commentsCount > 0 && (
                <Typography variant="caption">{commentsCount}</Typography>
              )}
            </div>

            <div>
              {likesCount > 0 && (
                <Typography variant="caption">{likesCount}</Typography>
              )}

              <IconButton className={classes.actionIcon} aria-label="like">
                <FontAwesomeIcon icon={["far", "heart"]} />
              </IconButton>
            </div>

            <IconButton className={classes.actionIcon} aria-label="share">
              <FontAwesomeIcon icon="share" />
            </IconButton>
          </div>
        </div>
      </Container>
      {commentsCount > 0 && !comments && (
        <Container
          className={classes.showComments}
          component="div"
          disableGutters
          onClick={() => fetchComments(id)}
        >
          <FontAwesomeIcon
            className={classes.showCommentsIcon}
            icon="ellipsis-v"
          />
          {!loadingComments ? (
            <Typography
              className={classes.showCommentsText}
              variant="subtitle1"
            >
              Show comments
            </Typography>
          ) : (
            <CircularProgress
              className={classes.commentsLoading}
              color="secondary"
              size="28px"
            />
          )}
        </Container>
      )}
      <div className={classes.comments}>{comments}</div>
    </Container>
  );
}

export default Card;
