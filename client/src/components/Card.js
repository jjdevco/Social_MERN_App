import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

// APP Components
import Media from "./Media";

// MUI Components
import clsx from "clsx";
import { fade, makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Date to time-string util
import * as timeago from "timeago.js";

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
    paddingRight: theme.spacing(4),
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
  },

  headerText: {
    width: "max-content",
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

  media: {
    marginBottom: theme.spacing(2),
    width: "100%",
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

function Card({
  id,
  username,
  userAvatar,
  body,
  commentsCount,
  likesCount,
  media,
  createdAt,
}) {
  const classes = useStyles();
  const history = useHistory();
  const menuRef = useRef();
  const [openShare, setOpenShare] = useState(false);

  const toProfile = (e) => {
    e.stopPropagation();
    return history.push(`/user/${username}`);
  };

  const copy = (e) => {
    const url = `${window.location.origin}/entry/${id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Copy URL to clipboard successfully!");
        setOpenShare(false);
      })
      .catch((err) => console.log(err));

    console.log(url, window.location);
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
            {username && username.charAt(0).toUpperCase()}
          </Avatar>

          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
        </div>
        <div className={classes.content}>
          <div className={classes.headerText}>
            <Typography
              className={classes.username}
              variant="h6"
              onClick={toProfile}
            >
              @{username}
            </Typography>

            <Typography className={classes.date} variant="body2">
              {timeago.format(createdAt, "en_EN")}
            </Typography>
          </div>
          <Typography
            className={clsx([classes.text, !media && classes.noMedia])}
            variant="body1"
          >
            {body}
          </Typography>

          {media && (
            <div className={classes.media}>
              <Media src={media} />
            </div>
          )}
        </div>
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

        <IconButton
          ref={menuRef}
          className={classes.actionIcon}
          aria-label="share"
          onClick={() => setOpenShare(true)}
        >
          <FontAwesomeIcon icon="share" />
        </IconButton>

        <Menu
          anchorEl={menuRef.current}
          open={openShare}
          onClose={() => setOpenShare(false)}
        >
          <MenuItem onClick={copy}>Copy Link</MenuItem>
        </Menu>
      </div>
    </Container>
  );
}

Card.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  userAvatar: PropTypes.string,
  body: PropTypes.string,
  commentsCount: PropTypes.number,
  likesCount: PropTypes.number,
  media: PropTypes.string,
  createdAt: PropTypes.string,
};

export default Card;
