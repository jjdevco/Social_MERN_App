import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

//Store
import { connect } from "react-redux";
import {
  updateLikesCount,
  setEntryDetails,
} from "../store/actions/entriesActions";

// Api Services
import api from "../services/api";

//MUI Components
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

//App Components
import EntryTop from "../components/EntryTop";
import Input from "../components/Input";
import Comments from "../components/Comments";
import ConfirmDelete from "../components/ConfirmDelete";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => ({
  loader: {
    margin: "auto",
  },

  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    margin: theme.spacing(1, 0),
    border: `4px solid ${theme.palette.primary.main}`,
    borderRadius: "5px",
    boxShadow: theme.shadows[5],
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
    margin: theme.spacing(0, 1),
  },

  entryDetailsIcon: {
    margin: theme.spacing(0, 1),
  },

  text: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  btnMinus: {
    color: theme.palette.error.light,
    "&:hover": {
      color: theme.palette.error.main,
    },
  },

  btnPlus: {
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
    [theme.breakpoints.only("xs")]: {
      marginLeft: 0,
    },
  },

  deleteButton: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
  },

  bottomBar: {
    [theme.breakpoints.only("xs")]: {
      marginBottom: "54px",
    },
  },
}));

function Entry({
  authenticated,
  userAuthenticated,
  username,
  id,
  commentsCount,
  likes,
  likesCount,
  updateLikesCount,
  setEntryDetails,
  ...props
}) {
  const history = useHistory();
  const params = useParams();
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);

  const [liked, setLiked] = useState(false);

  const likeEntry = () => {
    setLiked(true);
    updateLikesCount(likesCount + 1);
    return authenticated
      ? api.entries.like(id).catch((err) => console.log(err))
      : history.push("/signin");
  };

  const unlikeEntry = () => {
    setLiked(false);
    updateLikesCount(likesCount - 1);
    return authenticated
      ? api.entries.unlike(id).catch((err) => console.log(err))
      : history.push("/signin");
  };

  useEffect(() => {
    setLiked(likes.map((el) => el.entryId).indexOf(params.id) !== -1);
    api.entries
      .getOne(params.id)
      .then(({ data }) => {
        setEntryDetails(data);
        return setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [params, setEntryDetails, likes]);

  return loading ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <Fade key={id} in={!!id} timeout={600}>
      <div
        className={clsx([
          classes.container,
          !authenticated && classes.bottomBar,
        ])}
      >
        <div>
          <EntryTop />
          <Input type={"comments"} />
        </div>

        <div className={classes.entryDetails}>
          <Typography className={classes.entryDetailsBox}>
            <FontAwesomeIcon
              className={classes.entryDetailsIcon}
              icon={commentsCount > 0 ? "comments" : ["far", "comments"]}
            />
            <strong>{commentsCount}&nbsp;</strong>
            <span className={classes.text}>
              {commentsCount !== 1 ? "Comments" : "Comment"}
            </span>
          </Typography>
          <Typography className={classes.entryDetailsBox}>
            {authenticated && (
              <IconButton
                className={classes.btnMinus}
                size="small"
                onClick={() => unlikeEntry()}
                disabled={!liked}
              >
                <FontAwesomeIcon icon="minus" />
              </IconButton>
            )}
            <FontAwesomeIcon
              className={classes.entryDetailsIcon}
              icon={likesCount > 0 ? "heart" : ["far", "heart"]}
            />
            <strong>{likesCount}&nbsp;</strong>
            <span className={classes.text}>
              {likesCount !== 1 ? "Likes" : "Like"}
            </span>
            {authenticated && (
              <IconButton
                className={classes.btnPlus}
                size="small"
                onClick={() => likeEntry()}
                disabled={liked}
              >
                <FontAwesomeIcon icon="plus" />
              </IconButton>
            )}
          </Typography>
          {userAuthenticated === username && (
            <Fade in={userAuthenticated === username} timeout={500}>
              <Typography className={classes.entryDetailsBox}>
                <Button
                  className={classes.deleteButton}
                  variant="outlined"
                  size="small"
                  endIcon={<FontAwesomeIcon icon="trash-alt" />}
                  onClick={() => setToDelete(id)}
                >
                  Delete
                </Button>
              </Typography>
            </Fade>
          )}
        </div>

        <Comments />

        <ConfirmDelete entry={toDelete} close={setToDelete} />
      </div>
    </Fade>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  userAuthenticated: state.user.credentials.username,
  likes: state.user.likes,
  ...state.entries.entry,
});

const mapActionsToProps = {
  updateLikesCount,
  setEntryDetails,
};

export default connect(mapStateToProps, mapActionsToProps)(Entry);
