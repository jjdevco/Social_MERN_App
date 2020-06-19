import React from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

// Store
import { connect } from "react-redux";

// App Components
import Media from "./Media";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

// Date to time-string util
import * as timeago from "timeago.js";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
    borderBottom: `3px solid ${theme.palette.secondary.light}`,
  },

  headerAvatar: {
    width: "60px",
    height: "60px",
    border: `2px solid ${theme.palette.primary.light}`,
    color: theme.palette.primary.contrastText,
  },

  headerText: {
    margin: theme.spacing(0.5, 2, 0, 2),
  },

  headerTextUsername: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  headerTextDate: {
    color: theme.palette.primary.light,
    fontWeight: "bold",
    wordWrap: "no-wrap",
  },

  entry: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1, 2),
  },

  entryMedia: {
    margin: theme.spacing(1, 0),
    boxShadow: theme.shadows[3],
    borderRadius: "5px",
  },
}));

function CardTop({ userAvatar, username, body, media, createdAt }) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div>
      <div className={classes.header}>
        <Avatar
          className={classes.headerAvatar}
          aria-label="avatar-user"
          alt="avatar-user"
          src={userAvatar}
        >
          {username ? username.charAt(0).toUpperCase() : ""}
        </Avatar>
        <div className={classes.headerText}>
          <Typography
            className={classes.headerTextUsername}
            variant="h6"
            onClick={() => history.push(`/user/${username}`)}
          >
            @{username}
          </Typography>
          <Typography className={classes.headerTextDate} variant="body2">
            {timeago.format(createdAt, "en_EN")}
          </Typography>
        </div>
      </div>
      <div className={classes.entry}>
        <Typography variant="subtitle1">{body}</Typography>
        {media && (
          <div className={classes.entryMedia}>
            <Media src={media} height={250} />
          </div>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  ...state.entries.entry,
});

CardTop.propTypes = {
  userAvatar: PropTypes.string,
  username: PropTypes.string,
  body: PropTypes.string,
  media: PropTypes.string,
  createdAt: PropTypes.string,
};

export default connect(mapStateToProps)(CardTop);
