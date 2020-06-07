import React, { useState, useEffect, createRef, forwardRef } from "react";

//Store
import { connect } from "react-redux";
import { closeEntryNew } from "../store/actions/entriesActions";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

//APP Components
import Input from "./Input";
import Media from "./Media";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "strech",
    border: `4px solid ${theme.palette.primary.main}`,
    boxShadow: theme.shadows[5],
    borderRadius: "10px",
    backgroundColor: theme.palette.background.light,
  },

  closeButton: {
    alignSelf: "end",
    margin: theme.spacing(2),
    fontSize: "26px",
    color: theme.palette.error.main,
    cursor: "pointer",
  },

  mediaContainer: {
    display: "flex",
    flexDirection: "column",
  },

  mediaCard: {
    height: "200px",
    maxWidth: "350px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    objectFit: "cover",
    margin: theme.spacing(2, 2, 1, 2),
    border: `2px solid ${theme.palette.primary.light}`,
    borderRadius: "5px",
    backgroundColor: theme.palette.background.main,
    cursor: "pointer",
    color: theme.palette.primary.main,
    transition: theme.transitions.create(),
    "&:hover": {
      color: theme.palette.primary.dark,
      borderColor: theme.palette.primary.main,
    },
  },

  mediaCardIcon: {
    color: "inherit",
    transition: theme.transitions.create(),
  },

  mediaInput: { opacity: 0, position: "absolute", zIndex: -1 },

  helper: {
    height: "32px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: theme.spacing(0, 3, 2, 3),
    color: theme.palette.error.main,
  },

  helperText: {
    maxWidth: "200px",
    marginRight: theme.spacing(2),
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const Uploader = forwardRef((props, ref) => {
  const classes = useStyles();
  const [file, setFile] = useState({});
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const { name, type, size } = e.target.files[0];
    const validFormats = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/webm",
      "video/ogg",
      "video/mp4",
      "video/3gp",
    ];

    setError("");

    if (size > 25000000) {
      cleanMedia();
      return setError("Max. size 20MB.");
    }

    if (!validFormats.some((format) => format === type)) {
      cleanMedia();
      return setError("Unsupported media type.");
    }

    setFile({
      name,
      src: URL.createObjectURL(e.target.files[0]),
    });
  };

  const cleanMedia = () => {
    URL.revokeObjectURL(file.src);
    setError("");
    setFile({});
  };

  useEffect(() => {
    return () => {
      if (file.src) URL.revokeObjectURL(file.src);
    };
  });

  return (
    <div className={classes.mediaContainer}>
      <label className={classes.mediaCard} htmlFor="upload-media">
        {!file.src && (
          <FontAwesomeIcon
            className={classes.mediaCardIcon}
            icon="photo-video"
            size="4x"
          />
        )}
        {file.src && (
          <Media
            height={200}
            src={file.src}
            name={file.name}
            blob={true}
            controls={false}
          />
        )}
      </label>
      <input
        className={classes.mediaInput}
        ref={ref}
        type="file"
        name="media"
        id="upload-media"
        onChange={handleFile}
      />
      <div className={classes.helper}>
        <Typography
          className={classes.helperText}
          color={error ? "error" : "primary"}
          variant="body2"
        >
          <strong>File: </strong>
          {error ? error : file.name ? file.name : "none."}
        </Typography>
        {file.src && (
          <Button
            color="inherit"
            size="small"
            variant="outlined"
            onClick={() => cleanMedia()}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
});

function New({ open, closeEntryNew, ...props }) {
  const classes = useStyles();
  const input = createRef();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={() => closeEntryNew()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <FontAwesomeIcon
            onClick={closeEntryNew}
            className={classes.closeButton}
            icon={["far", "times-circle"]}
          />
          <Input media={input} type="entries" />
          <Uploader ref={input} />
        </div>
      </Fade>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  open: state.entries.entryNew,
});

const mapActionsToProps = {
  closeEntryNew,
};

export default connect(mapStateToProps, mapActionsToProps)(New);
