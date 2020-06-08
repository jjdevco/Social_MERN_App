import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//Store
import { connect } from "react-redux";
import { getEntries } from "../store/actions/entriesActions";

//MUI Components
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// APP Components
import Card from "./Card";

const useStyles = makeStyles((theme) => ({
  loading: {
    display: "flex",
    flexDirection: "row",
    margin: "auto",
  },

  entries: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
  },

  bottomBar: {
    [theme.breakpoints.only("xs")]: {
      marginBottom: "56px",
    },
  },
}));

function Home({ authenticated, getEntries, entries, ...props }) {
  const classes = useStyles();
  const { username } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      await getEntries(username);
      return setLoading(false);
    };
    fetch();
  }, [getEntries, username]);

  let recentEntries =
    entries.length > 0
      ? entries.map((entry) => <Card key={entry.id} data={entry} />)
      : "";

  return loading ? (
    <CircularProgress className={classes.loading} color="secondary" />
  ) : (
    <Fade in={!loading} timeout={400}>
      <Container
        className={clsx([classes.entries, !authenticated && classes.bottomBar])}
        component="div"
        disableGutters
      >
        {recentEntries}
      </Container>
    </Fade>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  entries: state.entries.entries,
});

const mapActionsToProps = {
  getEntries,
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
