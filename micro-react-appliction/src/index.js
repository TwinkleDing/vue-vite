import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

function render(props) {
  console.log(props);
  const { container } = props;
  const root = ReactDOM.createRoot(
    container
      ? container.querySelector("#MicroReactApp")
      : document.querySelector("#MicroReactApp")
  );

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
  console.log("MicroReactApp Bootstrap");
}

export async function mount(props) {
  console.log("MicroVueApp Mount", props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  console.log("MicroReactApp Unmount", container);
  // const root = ReactDOM.createRoot(
  //   container
  //     ? container.querySelector("#MicroReactApp")
  //     : document.querySelector("#MicroReactApp")
  // );
  // root.render(<div></div>);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
