import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import App2 from "./App2.jsx";
import App3 from "./App3.jsx";
import App4 from "./App4.jsx";
// 按鈕的寫法
import App5 from "./App5.jsx";
//陣列
import App6 from "./App6.jsx";
//物件陣列
import App7 from "./App7.jsx";
//物件陣列+table
import App8 from "./App8.jsx";
//父組件與子組件應用
import App9 from "./App9.jsx";
//父組件與子組件應用
import App10 from "./App10.jsx";
//組件間的參數傳遞以及 props參數集合
import App12 from "./App12.jsx";
//組件間 狀態驅動寫法  import { useState } from "react";
import App13 from "./App13.jsx";
//useState 與事件處理 + 展開運算子
import App15 from "./App15.jsx";
//課堂練習
import App16 from "./TodoList2.jsx";
//js模組化拆分
import App17 from "./TodoList5.jsx";

//課堂練習
import App18 from "./Cart.jsx";
//老師解答
import App19 from "./Cart2Ans.jsx";
//老師解答
import App20 from "./Cart3JSON.jsx";
//老師解答
import App21 from "./Cart4Split.jsx";

//bootStrap
import App22 from "./zztestBootStrap.jsx";
//import "./index.css";




ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode嚴格模式 代表app會渲染兩次
  <React.StrictMode>
    <App />
    {/*<App2 />
    <App3 />
    <App4 /> 
    <App5 />
    <App6 />
    <App7 />
    <App8 />
    <App9 />
    <App10 />
    <App12 />
    <App13 />
    <App15 />
    <App16 />*/}
    <App17 />
    <App18 />
    <App19 />
    <App20 />
    <App21 />
    <App22 />
  </React.StrictMode>
);
