import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Router
import { useHistory, useParams } from "react-router-dom";

// Store
import { connect } from "react-redux";
import { updateLikesCount, setEntry } from "../store/actions/entriesActions";

// Api
import api from "../services/api";

// MUI Components
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// App Components
import CardTop from "./CardTop";
import Input from "./Input";
import Comments from "./Comments";
import ConfirmDelete from "./ConfirmDelete";

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
    margin: theme.spacing(2, 0),
    border: `4px solid ${theme.palette.primary.main}`,
    borderRadius: "5px",
    boxShadow: theme.shadows[5],
  },

  entry: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(1, 0),
    borderBottom: `3px solid ${theme.palette.secondary.light}`,
    justifyContent: "space-evenly",
    fontSize: "24px",
    color: theme.palette.primary.dark,
  },

  entryBox: {
    height: "32px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: theme.spacing(0, 1),
  },

  entryIcon: {
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
}));

function FullCard({
  authenticated,
  userAuthenticated,
  username,
  id,
  commentsCount,
  likes,
  likesCount,
  updateLikesCount,
  setEntry,
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
        setEntry(data);
        return setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [params, setEntry, likes]);

  return loading ? (
    <CircularProgress className={classes.loader} />
  ) : (
    <Fade key={id} in={!!id} timeout={600}>
      <div className={clsx([classes.container])}>
        <div>
          <CardTop />
          <Input type={"comments"} />
        </div>

        <div className={classes.entry}>
          <Typography className={classes.entryBox}>
            <FontAwesomeIcon
              className={classes.entryIcon}
              icon={commentsCount > 0 ? "comments" : ["far", "comments"]}
            />
            <strong>{commentsCount}&nbsp;</strong>
            <span className={classes.text}>
              {commentsCount !== 1 ? "Comments" : "Comment"}
            </span>
          </Typography>
          <Typography className={classes.entryBox}>
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
              className={classes.entryIcon}
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
              <Typography className={classes.entryBox}>
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
  setEntry,
};

FullCard.propTypes = {
  authenticated: PropTypes.bool,
  userAuthenticated: PropTypes.string,
  username: PropTypes.string,
  id: PropTypes.string,
  likes: PropTypes.array,
  likesCount: PropTypes.number,
  commentsCount: PropTypes.number,
  updateLikesCount: PropTypes.func,
  setEntry: PropTypes.func,
};

export default connect(mapStateToProps, mapActionsToProps)(FullCard);
