import React from "react";

//Store
import { connect } from "react-redux";
import { closeEntryDetails } from "../store/actions/entriesActions";

// Date to Time util
import formatDate from "../utils/timeago";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

//App Components
import Media from "./Media";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    fontSize: "26px",
    color: theme.palette.error.main,
    cursor: "pointer",
  },

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
    flexGrow: 1,
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
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[5],
    borderRadius: "6px",
  },
}));

function CardDetailsTop({
  userAvatar,
  username,
  body,
  media,
  createdAt,
  closeEntryDetails,
  ...props
}) {
  const classes = useStyles();

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
          <Typography className={classes.headerTextUsername}>
            @{username}
          </Typography>
          <Typography className={classes.headerTextDate} variant="body2">
            {formatDate(createdAt)}
          </Typography>
        </div>
        <FontAwesomeIcon
          onClick={closeEntryDetails}
          className={classes.closeButton}
          icon={["far", "times-circle"]}
        />
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

const mapActionsToProps = {
  closeEntryDetails,
};

export default connect(mapStateToProps, mapActionsToProps)(CardDetailsTop);
