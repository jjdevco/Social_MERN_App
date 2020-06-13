import React from "react";
import PropTypes from "prop-types";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    boxShadow: theme.shadows[0],
    borderRadius: "4px",
    backgroundColor: theme.palette.background.main,
  },
  media: {
    objectFit: "cover",
  },
}));

function Media({ height = "100%", blob = false, name, src }) {
  const classes = useStyles();

  const isImage = /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/.test(
    blob ? name : src
  );

  const controls = blob ? false : isImage ? false : true;

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        src={src}
        height={height}
        component={isImage ? "img" : "video"}
        controls={controls}
      />
    </Card>
  );
}

Media.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  blob: PropTypes.bool,
  name: PropTypes.string,
  src: PropTypes.string.isRequired,
};

export default Media;
