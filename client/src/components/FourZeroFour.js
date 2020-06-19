import React from "react";

//Mui Components
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function FourZeroFour() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography align="center" variant="h3">
        <strong>404</strong>
      </Typography>

      <Typography variant="h4" align="center">
        Url not found
      </Typography>
    </div>
  );
}

export default FourZeroFour;
