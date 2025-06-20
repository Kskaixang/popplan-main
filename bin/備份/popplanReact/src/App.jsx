// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//導覽列
//import NavigationBar from "./a00NavigationBar";
import NavigationBar from "./a00Navbar";
//主頁
import Home from "./a01Home";
// import JsonViewer from "./components/testJson";
//活動創建
import EventForm from "./a03CreatEventPage";
//登入表單
//import Login from "./components/Login";
import AuthPage from "./a02AuthPage";

//get event/id
import EventDetail from "./a04EventDetail"

//session檢查  CheckSession
//import CheckSession from "./components/CheckSession";

//AI
import AI from './components/AIChatStreaming';


//結果呈現
import Result from "./a99Result";

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/json" element={<JsonViewer />} /> */}
        <Route path="/Eventform" element={<EventForm />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/Result" element={<Result />} />
        {/* <Route path="/CheckSession" element={<CheckSession />} /> */}
        <Route path="/AI" element={<AI />} />
        <Route path="/EventDetail" element={<EventDetail />} />
      </Routes>
    </Router>
  );
}
export default App;
