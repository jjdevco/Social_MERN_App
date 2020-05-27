import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { authenticate } from "../store/actions/userActions";

// MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// FontAwesome Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Form validator util
import { inputValidator } from "../utils/form";

import api from "../services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: theme.spacing(4, 0),
    padding: theme.spacing(5),
    border: `2px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.only("sm")]: {
      minHeight: "250px",
      minWidth: "250px",
    },
    [theme.breakpoints.up("md")]: {
      minHeight: "400px",
      minWidth: "400px",
    },
  },

  icon: {
    marginBottom: theme.spacing(3),
    color: theme.palette.primary.main,
    fontSize: "85px",
    [theme.breakpoints.up("md")]: {
      fontSize: "120px",
    },
  },

  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  input: {
    margin: theme.spacing(0.5, 0),
  },

  passwordIcon: {
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: "inherit",
      color: theme.palette.primary.dark,
    },
  },

  linkContainer: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    flexWrap: "wrap",
    margin: theme.spacing(1, 0, 3, 0),
  },

  text: {
    margin: theme.spacing(0, 0.5, 0, 1),
  },

  link: {
    margin: theme.spacing(0, 1, 0, 0.5),
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
}));

function SignUp({ authenticate, ...props }) {
  const history = useHistory();
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    username: false,
    email: false,
    password: false,
    repeatPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateUsername = () => {
    const { valid, error } = inputValidator(username, ["required"]);

    return !valid
      ? setFormErrors({ ...formErrors, username: error })
      : setFormErrors({ ...formErrors, username: false });
  };

  const validateEmail = () => {
    const { valid, error } = inputValidator(email, ["required", "email"]);
    return !valid
      ? setFormErrors({ ...formErrors, email: error })
      : setFormErrors({ ...formErrors, email: false });
  };

  const validatePassword = () => {
    const { valid, error } = inputValidator(password, [
      "required",
      "password",
      "minPassword",
      "maxPassword",
    ]);
    if (repeatPassword !== "") validateRepeatPassword();
    return !valid
      ? setFormErrors({ ...formErrors, password: error })
      : setFormErrors({ ...formErrors, password: false });
  };

  const validateRepeatPassword = () => {
    const { valid, error } = inputValidator(
      repeatPassword,
      ["required", "password", "minPassword", "maxPassword", "RepeatPassword"],
      password
    );

    return !valid
      ? setFormErrors({ ...formErrors, repeatPassword: error })
      : setFormErrors({ ...formErrors, repeatPassword: false });
  };

  const submit = () => {
    if (
      username !== "" &&
      email !== "" &&
      password !== "" &&
      repeatPassword !== ""
    ) {
      setLoading(true);
      api()
        .user.signUp({ username, email, password, repeatPassword })
        .then(({ data }) => {
          authenticate(data.token);
          return history.push("/");
        })
        .catch((error) => {
          setLoading(false);
          return !error.response
            ? alert(error)
            : error.status !== 500
            ? setFormErrors({ ...formErrors, ...error.response.data })
            : alert(error.response.data.error);
        });
    } else {
      alert("complete the form");
    }
  };

  return (
    <Container className={classes.root} component="div" disableGutters>
      <Card className={classes.card} elevation={6}>
        <FontAwesomeIcon className={classes.icon} icon="address-card" />
        <form className={classes.form}>
          <TextField
            className={classes.input}
            id="username"
            color="primary"
            variant="filled"
            label="Username"
            error={!!formErrors.username}
            helperText={formErrors.username || "Your username"}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={validateUsername}
          />
          <TextField
            className={classes.input}
            id="email"
            color="primary"
            variant="filled"
            label="Email"
            error={!!formErrors.email}
            helperText={formErrors.email || "Your email address"}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
          />
          <TextField
            className={classes.input}
            id="password"
            color="primary"
            variant="filled"
            label="Password"
            type={showPassword ? "text" : "password"}
            error={!!formErrors.password}
            helperText={formErrors.password || "Your password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className={classes.passwordIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon
                      icon={
                        showPassword ? ["far", "eye-slash"] : ["far", "eye"]
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
          />
          <TextField
            className={classes.input}
            id="repeatPassword"
            color="primary"
            variant="filled"
            label="Repeat password"
            type={showRepeatPassword ? "text" : "password"}
            error={!!formErrors.repeatPassword}
            helperText={formErrors.repeatPassword || "Repeat your password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className={classes.passwordIcon}
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  >
                    <FontAwesomeIcon
                      icon={
                        showRepeatPassword
                          ? ["far", "eye-slash"]
                          : ["far", "eye"]
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setRepeatPassword(e.target.value)}
            onBlur={validateRepeatPassword}
          />
        </form>
        <div className={classes.linkContainer}>
          <Typography className={classes.text}>Have an account?</Typography>
          <Link className={classes.link} to="/signin">
            Sign In here.
          </Link>
        </div>
        <Button
          id="submit"
          color="primary"
          variant="contained"
          fullWidth
          onClick={() => submit()}
          disabled={
            loading ||
            Object.values(formErrors).some((error) => error !== false)
              ? true
              : false
          }
        >
          {loading ? (
            <CircularProgress size="24px" color="secondary" />
          ) : (
            <Typography>Sign Up</Typography>
          )}
        </Button>
      </Card>
    </Container>
  );
}

const mapActionsToProps = {
  authenticate,
};

export default connect(null, mapActionsToProps)(SignUp);
