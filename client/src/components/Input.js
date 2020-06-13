import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory, useLocation } from "react-router-dom";

// Store
import { connect } from "react-redux";
import { addEntry, addComment } from "../store/actions/entriesActions";

// Api
import api from "../services/api";

// MUI Components
import clsx from "clsx";
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

function Input({
  type,
  authenticated,
  entryId,
  addEntry,
  addComment,
  credentials,
  media,
}) {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();

  const [activeInput, setActiveInput] = useState(false);
  const [input, setInput] = useState("");
  const [maxChars, setMaxChars] = useState(0);
  const [sending, setSending] = useState(false);

  const handleInput = (e) => {
    setMaxChars(e.target.value.length);
    setInput(e.target.value);
    return;
  };

  const send = () => {
    let content = {};

    if (!input) return;

    if (type === "entries") {
      content = new FormData();
      content.append("body", input);
      if (media.current.files[0])
        content.append(
          "media",
          media.current.files[0],
          media.current.files[0].name
        );
    } else {
      content.id = entryId;
      content.body = input;
    }

    setSending(true);

    const add = (data) =>
      type === "entries" ? addEntry(data) : addComment(data);

    if (authenticated)
      return api[type]
        .send(content)
        .then(({ data }) => {
          add(data);
          setMaxChars(0);
          setInput("");
          setSending(false);
          if (type === "entries") history.push(`/entry/${data.id}`);
        })
        .catch((err) => {
          setSending(false);
          console.log(err);
        });
    else {
      setSending(false);
      return history.push("/signin", { redirect: location.pathname });
    }
  };

  useEffect(() => {
    return () => {
      setActiveInput(false);
      setInput("");
      setMaxChars(0);
      setSending(false);
    };
  }, []);

  return (
    <div className={classes.input}>
      <Avatar
        className={classes.avatarInput}
        aria-label="avatar-input"
        alt="avatar-input"
        src={credentials.avatarUrl}
      >
        {credentials.username
          ? credentials.username.charAt(0).toUpperCase()
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
            placeholder="Share your thoughts..."
            classes={{
              root: classes.inputRoot,
            }}
            value={input}
            inputProps={{ "aria-label": "input" }}
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
        disabled={!input || maxChars > 250 || sending}
        disableFocusRipple={true}
        onClick={() => send()}
      >
        {sending ? (
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
  entryId: state.entries.entry.id,
});

const mapActionsToProps = {
  addEntry,
  addComment,
};

Input.propTypes = {
  media: PropTypes.object,
  authenticated: PropTypes.bool,
  type: PropTypes.string,
  entryId: PropTypes.string,
  credentials: PropTypes.object,
  addEntry: PropTypes.func,
  addComment: PropTypes.func,
};

export default connect(mapStateToProps, mapActionsToProps)(Input);
