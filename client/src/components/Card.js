import React, { useState } from "react";
import { Link } from "react-router-dom";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// APP Components
import Media from "./Media";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Date to Time util
import formatDate from "../utils/timeago";

const useStyles = makeStyles((theme) => ({
  root: {
    borderColor: "lightgray",
    borderWidth: "5px",
    borderStyle: "solid none solid none",
    cursor: "pointer",
  },

  card: {
    display: "flex",
    flexDirection: "row",
    "&:hover": {
      backgroundColor: "rgb(240,240,240)",
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
    margin: theme.spacing(2),
    border: `2px solid ${theme.palette.secondary.light}`,
    color: "#000",
  },

  divider: { flexGrow: 1, margin: "auto", width: "3px" },

  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    padding: theme.spacing(1, 2, 1, 1),
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
    color: "#707070",
  },

  text: {
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
  },

  actionIcon: {
    padding: theme.spacing(1),
    fontSize: "20px",
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: "rgba(79, 179, 191, 0.2)",
      color: theme.palette.secondary.dark,
    },
  },

  showComments: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(1, 0),
    "&:hover": {
      backgroundColor: "rgb(240,240,240)",
    },
  },

  showCommentsIcon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "15px",
    minWidth: "86px",
    color: "gray",
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

  const fetchComments = () => setLoadingComments(true);

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
            <IconButton className={classes.actionIcon} aria-label="comment">
              <FontAwesomeIcon icon={["far", "comment"]} />

              {commentsCount > 0 && (
                <Typography variant="caption">
                  &nbsp; {commentsCount}
                </Typography>
              )}
            </IconButton>
            <IconButton className={classes.actionIcon} aria-label="like">
              <FontAwesomeIcon icon={["far", "heart"]} />

              {likesCount > 0 && (
                <Typography variant="caption">&nbsp; {likesCount}</Typography>
              )}
            </IconButton>
            <IconButton className={classes.actionIcon} aria-label="share">
              <FontAwesomeIcon icon={["far", "share-square"]} />
            </IconButton>
          </div>
        </div>
      </Container>
      {commentsCount > 0 && !commentsFetched && (
        <Container
          className={classes.showComments}
          component="div"
          disableGutters
          onClick={fetchComments}
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
      {commentsFetched}
    </Container>
  );
}

export default Card;
