//路由 插件導入
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HelloWorld from "./pages/HelloWorld";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hello" element={<HelloWorld />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
