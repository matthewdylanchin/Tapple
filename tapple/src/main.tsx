import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // optional (remove if you don't have it)
import TappleGame from "./TappleGame";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TappleGame />
  </React.StrictMode>
);
