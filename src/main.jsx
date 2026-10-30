import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PromptMarketCase from "./PromptMarketCase";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/\/prompt-market(?:\.html)?\/?$/.test(window.location.pathname) ? <PromptMarketCase /> : <App />}
  </React.StrictMode>,
);
