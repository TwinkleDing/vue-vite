import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

let instance = null;

function render(props) {
  const { container } = props;
  instance = ReactDOM.createRoot(
    container
      ? container.querySelector("#MicroReactApp")
      : document.querySelector("#MicroReactApp")
  );

  instance.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}
export async function bootstrap() {
  console.log("MicroReactApp Bootstrap");
}

export async function mount(props) {
  console.log("MicroReactApp Mount", props);
  render(props);
}

export async function unmount(props) {
  instance.unmount();
  instance = null;
  console.log("MicroReactApp Unmount", props);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
