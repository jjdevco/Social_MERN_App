import React, { useEffect } from "react";

//Store
import { connect } from "react-redux";
import { getEntries } from "../store/actions/entriesActions";

//MUI Components
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";

// APP Components
import Card from "../components/Card";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
    padding: theme.spacing(1),
  },

  bottomBar: {
    [theme.breakpoints.only("xs")]: {
      marginBottom: "56px",
    },
  },

  loading: {
    margin: "auto",
  },
}));

function Home({ authenticated, getEntries, entries, entry, ...props }) {
  const classes = useStyles();

  useEffect(() => {
    getEntries();
  }, [getEntries, entry]);

  let recentEntries =
    entries.length > 0 ? (
      entries.map((entry) => <Card key={entry.id} data={entry} />)
    ) : (
      <CircularProgress className={classes.loading} color="secondary" />
    );

  return (
    <Container
      className={clsx([classes.container, !authenticated && classes.bottomBar])}
      component="div"
      disableGutters
    >
      {recentEntries}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  entries: state.entries.entries,
  entry: state.entries.entry,
});

const mapActionsToProps = {
  getEntries,
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
