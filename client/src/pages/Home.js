import React, { useEffect, useState } from "react";

// API Sercives func
import api from "../services/api";

//MUI Components
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

// APP Components
import Card from "../components/Card";

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "calc(100vh - 56px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderWidth: "2px",
    borderColor: "lightgray",
    borderStyle: "none solid none solid",
    paddingBottom: theme.spacing(1),
  },
}));

function Home(props) {
  const classes = useStyles();
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    api.getAllEntries().then((entries) => setEntries(entries.data));
  }, []);

  let recentEntries = entries
    ? entries.map((entry) => <p key={entry.id}>{entry.body}</p>)
    : "loading...";

  return (
    <Container className={classes.container} component="div" disableGutters>
      <h1>Home</h1>
      {recentEntries}
      <Card />
    </Container>
  );
}

export default Home;
