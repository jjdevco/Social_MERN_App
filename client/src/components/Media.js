import React from "react";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    border: `2px solid ${theme.palette.primary.light}`,
    backgroundColor: theme.palette.background.main,
  },
  media: {
    objectFit: "cover",
  },
}));

function Media({ height = 250, ...props }) {
  const classes = useStyles();

  const isImage = /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/.test(
    props.src
  );

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        style={{}}
        src={props.src}
        height={height}
        component={isImage ? "img" : "video"}
        controls={isImage ? false : true}
      />
    </Card>
  );
}

export default Media;
