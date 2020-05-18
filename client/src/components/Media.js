import React from "react";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1, 0),
    border: `2px solid ${theme.palette.secondary.light}`,
    backgroundColor: "lightgray",
  },
}));

function Media(props) {
  const classes = useStyles();

  const imageExt = /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#]*\.(?:jpe?g|gif|png))(?:\?([^#]*))?(?:#(.*))?/.test(
    props.src
  );

  return (
    <Card className={classes.root}>
      <CardMedia
        src={props.src}
        component={imageExt ? "img" : "video"}
        controls={imageExt ? false : true}
      />
    </Card>
  );
}

export default Media;
