import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "@fontsource/public-sans";
import { CssBaseline } from "@mui/joy";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";


const container = document.getElementById("root")!;
const root = createRoot(container);

const theme = extendTheme({});

root.render(
  <Provider store={store}>
    <CssVarsProvider disableTransitionOnChange defaultMode='dark' theme={theme}>
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </Provider>
);


