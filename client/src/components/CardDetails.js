import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateLikesCount, clearModal } from "../store/actions/entriesActions";

// Api Services
import api from "../services/api";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

//App Components
import CardDetailsTop from "./CardDetailsTop";
import CardDetailsInput from "./CardDetailsInput";
import CardDetailsComments from "./CardDetailsComments";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "300px",
    overflowX: "auto",
  },

  card: {
    height: "calc(100vh - 150px)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(5),
    border: `3px solid ${theme.palette.primary.dark}`,
    boxShadow: theme.shadows[5],
    borderRadius: "5px",
    backgroundColor: theme.palette.background.main,
    [theme.breakpoints.down("sm")]: {
      width: "250px",
    },
    [theme.breakpoints.down("lg")]: {
      width: "400px",
    },
    [theme.breakpoints.only("xl")]: {
      width: "600px",
    },
  },

  entryDetails: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(1, 0),
    borderBottom: `3px solid ${theme.palette.secondary.light}`,
    justifyContent: "space-evenly",
    fontSize: "24px",
    color: theme.palette.primary.dark,
  },

  entryDetailsBox: {
    height: "32px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  entryDetailsIcon: {
    margin: theme.spacing(0, 1),
  },

  entryDetailsIconBtn: {
    height: "25px",
    width: "25px",
    margin: theme.spacing(0, 1),
    cursor: "pointer",
  },

  entryDetailsIconBtnMinus: {
    color: theme.palette.error.light,
    "&:hover": {
      color: theme.palette.error.main,
    },
  },

  entryDetailsIconBtnPlus: {
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

function CardDetails({
  authenticated,
  open,
  id,
  commentsCount,
  likesCount,
  updateLikesCount,
  clearModal,
  ...props
}) {
  const history = useHistory();
  const classes = useStyles();
  const [rendered, setRendered] = useState(false);

  const likeEntry = () =>
    authenticated
      ? api.entries
          .like(id)
          .then(({ data }) => updateLikesCount(data.likesCount))
          .catch((err) => console.log(err))
      : history.push("/signin", { redirect: "/" });

  const unlikeEntry = () =>
    authenticated
      ? api.entries
          .unlike(id)
          .then(({ data }) => updateLikesCount(data.likesCount))
          .catch((err) => console.log(err))
      : history.push("/signin", { redirect: "/" });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onRendered={() => setRendered(true)}
      onClose={clearModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 400,
      }}
      disableBackdropClick
      closeAfterTransition
    >
      <Fade in={open}>
        <div className={classes.card}>
          <div>
            <CardDetailsTop />
            <CardDetailsInput />
          </div>

          <div className={classes.entryDetails}>
            <Typography className={classes.entryDetailsBox}>
              <FontAwesomeIcon
                className={classes.entryDetailsIcon}
                icon="comments"
              />
              <strong>{commentsCount}&nbsp;</strong>
              {commentsCount !== 1 ? "Comments" : "Comment"}
            </Typography>
            <Typography className={classes.entryDetailsBox}>
              <IconButton
                className={classes.entryDetailsIconBtn}
                size="small"
                onClick={() => unlikeEntry()}
              >
                <FontAwesomeIcon
                  className={classes.entryDetailsIconBtnMinus}
                  icon="minus"
                />
              </IconButton>
              <Fade in={true}>
                <strong>{likesCount}&nbsp;</strong>
              </Fade>
              {likesCount !== 1 ? "Likes" : "Like"}
              <IconButton
                className={classes.entryDetailsIconBtn}
                size="small"
                onClick={() => likeEntry()}
              >
                <FontAwesomeIcon
                  className={classes.entryDetailsIconBtnPlus}
                  icon="plus"
                />
              </IconButton>
            </Typography>
          </div>
          <CardDetailsComments rendered={rendered} />
        </div>
      </Fade>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  open: state.entry.modal,
  ...state.entry.data,
});

const mapActionsToProps = {
  updateLikesCount,
  clearModal,
};

export default connect(mapStateToProps, mapActionsToProps)(CardDetails);
