// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//session容器
import { SessionProvider } from './components/Provider/SessionProvider';
//event容器
import { EventProvider } from './components/Provider/EventProvider';
//STOMP通道容器
import { WebSocketProvider } from './components/Provider/WebSocketProvider';
//彈框
import { ToastContainer } from 'react-toastify';
// 攔截器
import FilterRoute from './components/FilterRoute';

//導覽列
import NavigationBar from "./Navbar";
//主頁
import Home from "./PageHome";
//活動創建
import PageEventForm from "./PageCreatEventPage";
//登入表單
import PageAuth from "./PageAuth";
//基本頁面
import PageEventDetail from "./PageEventDetail"
import PageTransaction from "./PageTransaction"
import Pagenotification from "./Pagenotification"

//功能頁
import PagemyEvents from "./PagemyEvents";
import PageFavoriteEvent from "./PageFavoriteEvent";
import PageOrder from "./PageOrder";
import PageUser from "./PageUser";

//AI
import AI from './components/AIChatStreaming';

//結果呈現
import PageResultEmail from "./PageResultEmail";
import PageResultPaymentSuccess from "./PageResultPaymentSuccess";


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
              <Route path="/login" element={<PageAuth />} />

              {/* 活動頁 */}
              <Route path="/event/:eventId" element={<PageEventDetail />} />

              {/* 以下都需要登入檢查 才能進入 */}
              <Route element={<FilterRoute />}>
                {/* 建立活動頁 */}
                <Route path="/Eventform" element={<PageEventForm />} />

                {/* 支付頁面 */}
                <Route path="/registration/:registrationId" element={<PageTransaction />} />

                {/* 功能頁 建立紀錄 */}
                <Route path="/myCreatedEvents" element={<PagemyEvents />} />
                {/* 功能頁 收報名 */}
                <Route path="/FavoriteEvent" element={<PageFavoriteEvent />} />
                {/* 功能頁 報名紀錄 */}
                <Route path="/order" element={<PageOrder />} />
                {/* 功能頁 通知頁 */}
                <Route path="/notification" element={<Pagenotification />} />
                {/* 功能頁 通知頁 */}
                <Route path="/PageUser" element={<PageUser />} />


              </Route>
              {/* 結果頁 */}
              <Route path="/Result" element={<PageResultEmail />} />
              <Route path="/paymentSuccess" element={<PageResultPaymentSuccess />} />


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
