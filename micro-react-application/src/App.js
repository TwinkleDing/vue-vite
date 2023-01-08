import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./views/home";
import First from "./views/first";
import Second from "./views/second";

function App() {
  return (
    <BrowserRouter
      basename={window.__POWERED_BY_QIANKUN__ ? "/MicroReact" : "/"}
    >
      <Routes>
        <Route path="/" key="home" exact element={<Home />}></Route>
        <Route path="/first" key="first" exact element={<First />}></Route>
        <Route path="/second" key="second" exact element={<Second />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
