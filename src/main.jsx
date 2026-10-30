import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import PromptMarketCase from "./PromptMarketCase";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {window.location.pathname.endsWith('/prompt-market.html') ? <PromptMarketCase /> : <App />}
  </React.StrictMode>,
);
