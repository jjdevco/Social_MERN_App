import React, { useState } from "react";

// Api Services
import api from "../services/api";

//Store
import { connect } from "react-redux";
import { closeEntryRemove, removeEntry } from "../store/actions/entriesActions";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

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

  title: {
    margin: theme.spacing(1, 1, 0, 1),
    color: theme.palette.primary.dark,
  },

  buttons: {
    minWidth: "250px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: theme.spacing(2),
  },

  cancel: {
    width: "90px",
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },

  confirm: {
    width: "90px",
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

function ConfirmDelete({ entry, removeEntry, closeEntryRemove, ...props }) {
  const classes = useStyles();
  const [deleting, setDeleting] = useState(false);

  const remove = () => {
    setDeleting(true);

    return api.entries
      .delete(entry)
      .then(() => {
        removeEntry(entry);
        closeEntryRemove();
        setDeleting(false);
      })
      .catch((err) => {
        setDeleting(false);
        console.log(err);
      });
  };

  return (
    <Modal
      className={classes.modal}
      open={!!entry}
      onClose={() => closeEntryRemove()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
      }}
    >
      <Fade in={!!entry}>
        <div className={classes.paper}>
          <Typography className={classes.title} align="center" variant="h5">
            Are you sure?
          </Typography>
          <div className={classes.buttons}>
            <Button
              className={classes.cancel}
              variant="contained"
              onClick={() => closeEntryRemove()}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              className={classes.confirm}
              variant="contained"
              onClick={() => remove()}
              disabled={deleting}
            >
              {deleting ? (
                <CircularProgress color="secondary" size="24px" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  entry: state.entries.toRemove,
});

const mapActionsToProps = {
  closeEntryRemove,
  removeEntry,
};

export default connect(mapStateToProps, mapActionsToProps)(ConfirmDelete);
