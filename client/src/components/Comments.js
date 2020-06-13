import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Store
import { connect } from "react-redux";

// App Components
import Comment from "./Comment";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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

function Comments({ comments }) {
  const classes = useStyles();

  useEffect(() => {}, [comments]);

  const Comments = comments
    ? comments.map((comment, index) => (
        <CSSTransition classNames="fade" key={index} timeout={300}>
          <Comment
            key={index}
            username={comment.username}
            userAvatar={comment.userAvatar}
            body={comment.body}
            createdAt={comment.createdAt}
            first={index === 0}
            last={index === comments.length - 1}
          />
        </CSSTransition>
      ))
    : "";

  return (
    <div className={classes.comments}>
      <TransitionGroup>{Comments}</TransitionGroup>
    </div>
  );
}

const mapStateToProps = (state) => ({
  comments: state.entries.entry.comments,
});

Comments.propTypes = {
  comments: PropTypes.array,
};

export default connect(mapStateToProps)(Comments);
