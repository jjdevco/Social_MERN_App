import React, { useEffect, useState } from "react";

// API Sercives func
import api from "../services/api";

//MUI Components
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

    borderWidth: "2px",
    borderColor: theme.palette.tertiary.main,
    borderStyle: "none solid none solid",
  },

  loading: {
    margin: "auto",
  },
}));

function Home(props) {
  const classes = useStyles();
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    api.getAllEntries().then((entries) => setEntries(entries.data));
  }, []);

  let recentEntries = entries ? (
    entries.map((entry) => <Card key={entry.id} data={entry} />)
  ) : (
    <CircularProgress className={classes.loading} color="secondary" />
  );

  return (
    <Container className={classes.container} component="div" disableGutters>
      <h1>Home</h1>
      {recentEntries}
    </Container>
  );
}

export default Home;
