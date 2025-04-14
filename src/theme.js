import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shadows: [
    "none", // shadow[0]
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)", // shadow[1]
    // Добавьте остальные значения теней, если нужно
    // ...
  ],
  palette: {
    primary: {
      main: "#4361ee",
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
});
