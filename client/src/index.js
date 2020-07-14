import React from "react";
import ReactDom from "react-dom";
import App from "./App";
import StateProvider, { store } from "./Context/Store";
console.log(store);
ReactDom.render(
  <StateProvider>
    <App />
  </StateProvider>,
  document.querySelector("#root")
);
