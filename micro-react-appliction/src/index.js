import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("MicroReactApp"));
function render(props) {
  const { container } = props;
  container
    ? container.querySelector("#MicroReactApp")
    : document.querySelector("#MicroReactApp");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}
export async function bootstrap() {
  console.log("[react16] react app bootstraped");
}

export async function mount(props) {
  console.log("[react16] props from main framework", props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  root.unmount(
    container
      ? container.querySelector("#MicroReactApp")
      : document.querySelector("#MicroReactApp")
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
