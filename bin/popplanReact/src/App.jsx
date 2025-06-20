// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//session容器
import { SessionProvider } from './components/Provider/SessionProvider';
//event容器
import { EventProvider } from './components/Provider/EventProvider';
//STOMP通道容器
import { WebSocketProvider } from './components/Provider/WebSocketProvider';
//彈框
import { ToastContainer } from 'react-toastify'; //ToastContainer

// 攔截器
import FilterRoute from './components/FilterRoute';


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
import Transaction from "./a05Transaction"

import Notification from "./a09notification"


//功能頁
import MyEvents from "./a06myEvents";
import FavoriteEvent from "./a07favoriteEvent";
import Order from "./a08Order";

//session檢查  CheckSession
//import CheckSession from "./components/CheckSession";

//AI
import AI from './components/AIChatStreaming';


//結果呈現
import Result from "./a99Result";
import PaymentSuccess from "./a99PaymentSuccess";


function App() {
  return (

    //容器
    <SessionProvider>
      <ToastContainer   //全域通知框 網頁建議放在最上層 且是唯一
        position="top-right"
        autoClose={3500}          // 2 秒自動關閉
        hideProgressBar={false}   // 顯示進度條
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"             // light / dark / colored
        style={{ top: '80px' }}
      />
      <EventProvider>
        <WebSocketProvider>
          <Router>

            <NavigationBar />


            <Routes>

              <Route path="/" element={<Home />} />
              {/* <Route path="/json" element={<JsonViewer />} /> */}

              {/* 登入與註冊 */}
              <Route path="/login" element={<AuthPage />} />

              {/* 活動頁 */}
              <Route path="/event/:eventId" element={<EventDetail />} />

              {/* 以下都需要登入檢查 才能進入 */}
              <Route element={<FilterRoute />}>
                {/* 建立活動頁 */}
                <Route path="/Eventform" element={<EventForm />} />

                {/* 支付頁面 */}
                <Route path="/registration/:registrationId" element={<Transaction />} />

                {/* 功能頁 建立紀錄 */}
                <Route path="/myCreatedEvents" element={<MyEvents />} />
                {/* 功能頁 收報名 */}
                <Route path="/FavoriteEvent" element={<FavoriteEvent />} />
                {/* 功能頁 報名紀錄 */}
                <Route path="/order" element={<Order />} />
                {/* 功能頁 通知頁 */}
                <Route path="/notification" element={<Notification />} />


              </Route>
              {/* 結果頁 */}
              <Route path="/Result" element={<Result />} />
              <Route path="/paymentSuccess" element={<PaymentSuccess />} />


              {/* util */}
              <Route path="/AI" element={<AI />} />


            </Routes>

          </Router>
        </WebSocketProvider>
      </EventProvider>
    </SessionProvider>
  );
}
export default App;
