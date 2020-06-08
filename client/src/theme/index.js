import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

export const appTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fb3bf",
      main: "#00838f",
      dark: "#005662",
      contrastText: "#fff",
    },
    secondary: {
      light: "#cfd8dc",
      main: "#90a4ae",
      dark: "#607d8b",
      contrastText: "#000",
    },
    background: {
      light: "#fff",
      main: "#f0f0f0",
      dark: "#dcdcdc",
      contrastText: "#000",
    },
    error: {
      light: "#ff6659",
      main: "#d32f2f",
      dark: "#9a0007",
    },
  },
});
