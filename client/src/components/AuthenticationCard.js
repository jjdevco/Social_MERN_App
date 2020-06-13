import React from "react";

// Router
import { Link } from "react-router-dom";

// Mui Components
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    padding: theme.spacing(2),
  },

  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    color: theme.palette.primary.dark,
  },

  button: {
    margin: theme.spacing(1, 0),
    borderRadius: "15px",
    borderWidth: "2px",
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": {
      borderWidth: "2px",
    },
  },
}));

export default function AuthenticationCard() {
  const classes = useStyles();
  return (
    <Fade in={true} timeout={400}>
      <div className={classes.card}>
        <Typography
          className={classes.title}
          variant="subtitle1"
          align="center"
        >
          Authenticate to post and get notifications.
        </Typography>
        <Button
          className={classes.button}
          color="primary"
          variant="outlined"
          component={Link}
          to="/signin"
        >
          Sign In
        </Button>
        <Typography variant="body1" align="center">
          or
        </Typography>
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          size="medium"
          component={Link}
          to="/signup"
          disableElevation
        >
          Sign Up
        </Button>
      </div>
    </Fade>
  );
}
