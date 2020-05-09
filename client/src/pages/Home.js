import React, { useEffect, useState } from "react";
import api from "../services/api";

function Home(props) {
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    api.getAllEntries().then((entries) => setEntries(entries.data));
  }, []);

  let recentEntries = entries
    ? entries.map((entry) => <p key={entry.id}>{entry.body}</p>)
    : "loading...";

  return (
    <div>
      <h1>Home</h1>
      {recentEntries}
    </div>
  );
}

export default Home;
