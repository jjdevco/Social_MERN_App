import React, { useState, useEffect } from "react";

//Store
import { connect } from "react-redux";
import { getComments } from "../store/actions/entriesActions";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

//App Components
import Comment from "./Comment";

const useStyles = makeStyles((theme) => ({
  commentsLoading: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },

  comments: {
    minHeight: "200px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    transition: theme.transitions.create(),
  },
}));

function CardDetailsComments({
  rendered,
  open,
  id,
  commentsCount,
  likesCount,
  comments,
  getComments,
  ...props
}) {
  const classes = useStyles();

  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      if (rendered && commentsCount > 0) {
        setLoadingComments(true);
        return getComments(id);
      }
    }
    fetchComments();
  }, [rendered, id, commentsCount, getComments]);

  useEffect(() => {
    if (loadingComments) setLoadingComments(false);
  }, [comments, loadingComments]);

  const Comments = comments
    ? comments.map((comment, index) => (
        <Comment
          key={index}
          data={comment}
          first={index === 0}
          last={index === comments.length - 1}
        />
      ))
    : comments;

  return loadingComments ? (
    <div className={classes.commentsLoading}>
      <CircularProgress color="secondary" size="32px" />
    </div>
  ) : (
    <div className={classes.comments}>{Comments}</div>
  );
}

const mapStateToProps = (state) => ({
  open: state.entries.entryDetails,
  comments: state.entries.comments,
  ...state.entries.entry,
});

const mapActionsToProps = {
  getComments,
};

export default connect(mapStateToProps, mapActionsToProps)(CardDetailsComments);
