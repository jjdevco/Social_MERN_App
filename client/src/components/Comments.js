import React, { useEffect } from "react";

//Store
import { connect } from "react-redux";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";

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

function Comments({ comments, ...props }) {
  const classes = useStyles();

  useEffect(() => {}, [comments]);

  const Comments = comments
    ? comments.map((comment, index) => (
        <Comment
          key={index}
          data={comment}
          first={index === 0}
          last={index === comments.length - 1}
        />
      ))
    : "";

  return <div className={classes.comments}>{Comments}</div>;
}

const mapStateToProps = (state) => ({
  comments: state.entries.entry.comments,
});

export default connect(mapStateToProps)(Comments);
