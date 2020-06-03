import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { connect } from "react-redux";
import { addComment } from "../store/actions/entriesActions";

// Api Services
import api from "../services/api";

//MUI Components
import { fade, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  input: {
    display: "flex",
    flexDirection: "row",
    alignItems: "start",
    borderWidth: "3px",
    borderStyle: "solid none solid none",
    borderColor: theme.palette.secondary.light,
    padding: theme.spacing(3, 2, 1, 2),
  },

  avatarInput: {
    width: "36px",
    height: "36px",
    border: `2px solid ${theme.palette.primary.light}`,
    color: theme.palette.secondary.contrastText,
    backgroundColor: fade(theme.palette.secondary.light, 0.5),
  },

  inputBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "100%",
  },

  inputField: {
    display: "flex",
    flexGrow: 1,
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: theme.palette.primary.light,
    borderRadius: "10px",
    backgroundColor: fade(theme.palette.background.dark, 0.7),
    padding: theme.spacing(0, 1),
    margin: theme.spacing(0, 1, 0, 2),
    transition: theme.transitions.create(),
  },

  inputFieldActive: {
    borderColor: theme.palette.primary.main,
    backgroundColor: fade(theme.palette.background.dark, 0.2),
  },

  inputFieldInvalid: {
    borderColor: theme.palette.error.main,
  },

  inputRoot: {
    width: "100%",
    padding: theme.spacing(1),
  },

  inputCounter: {
    margin: theme.spacing(0.5, 2),
    color: theme.palette.primary.dark,
    transition: theme.transitions.create(),
  },

  inputCounterInvalid: {
    color: theme.palette.error.main,
  },

  inputButton: {
    height: "38px",
    width: "38px",
    fontSize: "24px",
    padding: 0,
    color: theme.palette.primary.main,
    cursor: "pointer",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
}));

function CardDetailsInput({ open, authenticated, id, addComment, ...props }) {
  const history = useHistory();
  const classes = useStyles();

  const [activeInput, setActiveInput] = useState(false);
  const [comment, setComment] = useState("");
  const [maxChars, setMaxChars] = useState(0);
  const [sendingComment, setSendingComment] = useState(false);

  const input = useRef();

  const handleInput = (e) => {
    setMaxChars(e.target.value.length);
    setComment(e.target.value);
    return;
  };

  const sendComment = () => {
    if (!comment) return;

    setSendingComment(true);

    if (authenticated)
      return api.comments
        .send(id, comment)
        .then(({ data }) => {
          addComment(data);
          setMaxChars(0);
          setComment("");
          setSendingComment(false);
        })
        .catch((err) => {
          setSendingComment(false);
          console.log(err);
        });
    else {
      setSendingComment(false);
      return history.push("/signin", { redirect: "/" });
    }
  };

  useEffect(() => {
    setActiveInput(false);
    setComment("");
    setMaxChars(0);
    setSendingComment(false);
  }, [open]);

  return (
    <div className={classes.input}>
      <Avatar
        className={classes.avatarInput}
        aria-label="avatar-input"
        alt="avatar-input"
        src={props.credentials.avatarUrl}
      >
        {props.credentials.username
          ? props.credentials.username.charAt(0).toUpperCase()
          : ""}
      </Avatar>
      <div className={classes.inputBox}>
        <div
          className={clsx([
            classes.inputField,
            activeInput && classes.inputFieldActive,
            maxChars > 250 && classes.inputFieldInvalid,
          ])}
        >
          <InputBase
            ref={input}
            placeholder="Share your thoughts..."
            classes={{
              root: classes.inputRoot,
            }}
            value={comment}
            inputProps={{ "aria-label": "comment" }}
            onFocus={() => setActiveInput(true)}
            onBlur={() => setActiveInput(false)}
            onChange={handleInput}
            multiline
          />
        </div>
        <Typography
          className={clsx(
            classes.inputCounter,
            maxChars > 250 && classes.inputCounterInvalid
          )}
          align="right"
          variant="caption"
        >
          {maxChars} / 250 Max.
        </Typography>
      </div>
      <IconButton
        className={classes.inputButton}
        disabled={!comment || maxChars > 250 || sendingComment}
        disableFocusRipple={true}
        onClick={() => sendComment()}
      >
        {sendingComment ? (
          <CircularProgress size="28px" color="secondary" />
        ) : (
          <FontAwesomeIcon icon="comment-dots" />
        )}
      </IconButton>
    </div>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  credentials: state.user.credentials,
  open: state.entry.modal,
  ...state.entry.data,
});

const mapActionsToProps = {
  addComment,
};

export default connect(mapStateToProps, mapActionsToProps)(CardDetailsInput);
