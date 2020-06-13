import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory } from "react-router-dom";

// Store
import { connect } from "react-redux";
import {
  getProfile,
  updateAvatar,
  updateDetails,
  logOut,
} from "../store/actions/userActions";

// Api
import api from "../services/api";

//Mui Components
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: theme.spacing(2),
  },

  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
  },

  avatarWrapper: {
    display: "flex",
    alignSelf: "center",
    position: "relative",
  },

  avatar: {
    width: "120px",
    height: "120px",
    border: `2px solid ${theme.palette.primary.light}`,
    color: theme.palette.primary.dark,
    fontWeight: "bold",
    backgroundColor: theme.palette.background.main,
  },

  uploader: {
    position: "absolute",
    top: "80%",
    left: "75%",
    color: theme.palette.primary.main,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: theme.transitions.create(),
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
  },

  mediaInput: { opacity: 0, position: "absolute", zIndex: -1 },

  errorText: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
  },

  username: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
    margin: theme.spacing(1, 0),
  },

  bio: {
    maxHeight: "80px",
    overflowY: "auto",
    marginBottom: theme.spacing(0.5),
  },

  detailsText: {
    marginBottom: theme.spacing(0.5),
    color: theme.palette.primary.dark,
  },

  date: {
    color: theme.palette.secondary.dark,
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  exit: {
    color: theme.palette.error.main,
  },

  loading: {
    height: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "calc(100vw - 100%)",
  },

  paper: {
    width: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "strech",
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[5],
    borderRadius: "10px",
    backgroundColor: theme.palette.background.light,
  },

  modalTitle: {
    margin: theme.spacing(2, 2, 1, 2),
    color: theme.palette.primary.dark,
  },

  modalButtons: {
    minWidth: "200px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: theme.spacing(2),
  },

  form: {
    padding: theme.spacing(0, 4),
  },

  input: {
    margin: theme.spacing(1, 0),
  },

  modalCancel: {
    width: "90px",
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },

  modalConfirm: {
    width: "90px",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

function Profile({
  userLogged,
  profile,
  getProfile,
  updateAvatar,
  updateDetails,
  logOut,
}) {
  const classes = useStyles();

  const history = useHistory();
  const pathname = history.location.pathname;
  const username = pathname.replace("/user/", "");
  const match =
    pathname.startsWith("/user/") && userLogged.username !== username;

  const data = match && userLogged.username !== username ? profile : userLogged;

  const input = useRef();

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState("");

  const [form, setForm] = useState({ bio: "", address: "", website: "" });

  const handleFile = (e) => {
    const { type, size } = e.target.files[0];
    const validFormats = ["image/jpeg", "image/png", "image/gif"];

    setError("");

    if (size > 25000000) {
      return setError("Max. size 20MB.");
    } else if (!validFormats.some((format) => format === type)) {
      return setError("Unsupported media type.");
    } else {
      setUploading(true);

      let content = new FormData();

      content.append("media", e.target.files[0], e.target.files[0].name);

      return api.user
        .changeAvatar(content)
        .then(({ data }) => {
          updateAvatar(data);
          setUploading(false);
        })
        .catch((err) => {
          setUploading(false);
          console.log(err);
        });
    }
  };

  const handleInput = (e, input) => {
    let obj = form;
    obj[input] = e.target.value;
    setForm({ ...form });
  };

  const submit = async (e) => {
    setSaving(true);
    if (modal === "logout") {
      logOut();
      history.push("/");
    } else {
      let formData = {};

      for (let input in form) {
        if (!!form[input]) formData[input] = form[input].trimStart().trimEnd();
      }

      await api.user
        .updateInfo(formData)
        .then(() => {
          updateDetails(formData);
          setForm({ bio: "", address: "", website: "" });
        })
        .catch((err) => console.log(err));
    }
    setModal("");
    setSaving(false);
  };

  useEffect(() => {
    if (match) {
      setLoading(true);
      getProfile(username);
    }
  }, [getProfile, match, username]);

  useEffect(() => {
    if (data.username) setLoading(false);
  }, [data]);

  const formatDate = (date) => {
    if (!!date) return new Date(Date.parse(date)).toDateString();
    else return "";
  };

  return loading ? (
    <div className={classes.loading}>
      <CircularProgress color="primary" />
    </div>
  ) : (
    <Fade in={!loading || !uploading} timeout={400}>
      <div className={classes.card}>
        <div className={classes.avatarWrapper}>
          <Avatar
            className={classes.avatar}
            aria-label="avatar-user"
            alt="avatar-user"
            src={!uploading ? data.avatarUrl : ""}
          >
            {uploading ? (
              <CircularProgress />
            ) : (
              <Typography variant="h3">
                {data.username ? data.username.charAt(0).toUpperCase() : ""}
              </Typography>
            )}
          </Avatar>
          {userLogged.username === data.username && (
            <IconButton
              className={classes.uploader}
              onClick={() => input.current.click()}
              disabled={uploading}
            >
              <input
                className={classes.mediaInput}
                ref={input}
                type="file"
                id="upload-avatar"
                onChange={handleFile}
              />
              <FontAwesomeIcon icon={"camera"} />
            </IconButton>
          )}
        </div>
        <Typography
          className={classes.errorText}
          align="center"
          variant="caption"
        >
          <strong>{error}</strong>
        </Typography>

        <Typography
          className={classes.username}
          variant="h5"
          align="center"
          noWrap
        >
          @{data.username}
        </Typography>
        {!!data.bio && (
          <Typography
            className={classes.bio}
            variant="h6"
            align="center"
            component="div"
          >
            <strong>"</strong>
            {!!data.bio && data.bio}
            <strong>"</strong>
          </Typography>
        )}
        {!!data.address && (
          <Typography
            className={classes.detailsText}
            variant="subtitle2"
            align="center"
            noWrap
          >
            <FontAwesomeIcon icon="map-marker-alt" />
            &nbsp;{data.address}
          </Typography>
        )}
        {!!data.website && (
          <Typography
            className={classes.detailsText}
            variant="subtitle2"
            align="center"
            noWrap
          >
            <FontAwesomeIcon icon="link" />
            &nbsp;{data.website}
          </Typography>
        )}
        <Typography color="primary" variant="subtitle1" align="center" noWrap>
          <FontAwesomeIcon icon={["far", "calendar"]} />
          <strong>&nbsp;Joined&nbsp;</strong>
          <Typography className={classes.date}>
            {formatDate(data.createdAt)}
          </Typography>
        </Typography>
        {userLogged.username === data.username && (
          <Fade in={userLogged.username === data.username} timeout={400}>
            <div className={classes.actions}>
              <IconButton color="primary" onClick={() => setModal("edit")}>
                <FontAwesomeIcon icon="user-edit" />
              </IconButton>
              <IconButton
                className={classes.exit}
                onClick={() => setModal("logout")}
              >
                <FontAwesomeIcon icon="sign-out-alt" />
              </IconButton>
            </div>
          </Fade>
        )}

        <Modal
          className={classes.modal}
          open={!!modal}
          onClose={() => setModal("")}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 300,
          }}
          disableAutoFocus
          disableEnforceFocus
        >
          <Fade in={!!modal}>
            <div className={classes.paper}>
              <Typography
                className={classes.modalTitle}
                align={"center"}
                variant="h5"
              >
                {modal === "logout" && "Are you sure you want to logout now?"}
                {modal === "edit" && "Edit profile"}
              </Typography>

              {modal === "edit" && (
                <div className={classes.form}>
                  <TextField
                    className={classes.input}
                    label="Bio"
                    variant="outlined"
                    size="small"
                    type="textarea"
                    rowsMax="4"
                    multiline
                    fullWidth
                    onChange={(e) => handleInput(e, "bio")}
                  />
                  <TextField
                    className={classes.input}
                    label="Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => handleInput(e, "address")}
                  />
                  <TextField
                    className={classes.input}
                    label="Website"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => handleInput(e, "website")}
                  />
                </div>
              )}

              <div className={classes.modalButtons}>
                <Button
                  className={classes.modalCancel}
                  variant="contained"
                  onClick={() => setModal("")}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  className={classes.modalConfirm}
                  variant="contained"
                  onClick={submit}
                  disabled={saving}
                >
                  {modal === "logout" && "Confirm"}
                  {modal === "edit" &&
                    (saving ? (
                      <CircularProgress color="secondary" size="20px" />
                    ) : (
                      "Save"
                    ))}
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    </Fade>
  );
}

const mapStateToProps = (state) => ({
  userLogged: state.user.credentials,
  profile: state.user.profile,
  credentials: state.user.credentials,
});

const mapActionsToProps = {
  getProfile,
  updateAvatar,
  updateDetails,
  logOut,
};

Profile.propTypes = {
  userLogged: PropTypes.object,
  profile: PropTypes.object,
  getProfile: PropTypes.func,
  updateAvatar: PropTypes.func,
  updateDetails: PropTypes.func,
  logOut: PropTypes.func,
};

export default connect(mapStateToProps, mapActionsToProps)(Profile);
