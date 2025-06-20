import { Navbar, Nav, Form, Container, Button, Image, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { BsPencil, BsHeart, BsClock, BsPersonCircle, BsSearch, BsFilePlus, BsBorderAll, BsPencilSquare, BsPlusSquare } from 'react-icons/bs'; // 引入放大鏡圖示
import "./components/css/button.css";


function NavScrollExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登入狀態
  const [notificationCount, setNotificationCount] = useState(5); // 假設收藏報名有5個通知
  const [sessionData, setSessionData] = useState(null); //session
  //登出 清除session 的GET請求
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        credentials: 'include'
      });
      const resdata = res.json();
      console.log(resdata);
      setSessionData(null);
      setIsLoggedIn(false);
      if (res.status === 200) {
        alert('登出成功');
      } else {
        alert(`登出異常：${result.message}`);
      }
      // ✅ 清空登入狀態

    } catch (err) {
      console.error("登出失敗", err);
      alert('登出請求失敗');
    }


  };
  //加載 看8080的session JSON有沒有投射資料 有的話 當瀏覽器刷新 就會有用戶頭像
  useEffect(() => {
    fetch('http://localhost:8080/user/login/session', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error("Session not found or server error");
        return res.json();
      })
      .then(data => {
        setSessionData(data.data);     // ✅ 把 userDTO 存進狀態
        setIsLoggedIn(!!data.data);      // ✅ 使用者成功登入 !：把值轉成 布林值並取反!!：再取反一次，變回布林值，但保留了「真假性質」



        console.log("Session Data:", data);
      })
      .catch(err => {
        console.error(err);
        setIsLoggedIn(false);  // ❌ 沒登入或 session 遺失
        setSessionData(null);
      });
  }, []); // ✅ 只執行一次（掛載時）

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#e3f2fd', boxSizing: 'border-box', }}>
      <Container >
        {/* LOGO首頁區 */}
        <Link to="/">
          <Navbar.Brand href="#" className="fw-bold text-primary d-none d-md-block p-0 me-2">
            PopPlan
          </Navbar.Brand>
          <Navbar.Brand href="#" className="fw-bold text-primary d-md-none p-0 me-2">
            PP
          </Navbar.Brand>
        </Link>

        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="搜尋活動"
            className="me-2"
            aria-label="Search"
          />
          <Button variant="outline-success"><BsSearch /></Button>
        </Form>
        {/* 不知道 */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        {/* 漢堡 */}
        <Navbar.Collapse id="navbarScroll">

          {/* 舊版靠左<Nav className="ms-5 me-auto my-2 my-lg-0 gap-4 "> */}
          <Nav className="justify-content-end flex-grow-1 pe-3 gap-4 ">

            {/* 創建 */}
            <Nav.Link href="/Eventform" className='fs-5 navbar-bottom'>建立 <BsPlusSquare className='fs-4' /></Nav.Link>



            {/* 收藏報名 */}
            <Nav.Link href="/registrations" className='fs-5 navbar-bottom'>
              <div className="d-flex align-items-center">
                <span className="me-2">收藏報名</span>

                {/* 包裹愛心 & badge 用來相對定位 */}
                <div className="position-relative">
                  <BsHeart className="fs-4" />
                  {notificationCount > 0 && (
                    <span className="position-absolute badge rounded-pill bg-danger ">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </div>
            </Nav.Link>

            {/* 自己活動 */}
            <Nav.Link href="/Eventform" className='fs-5 navbar-bottom'>我的活動 <BsPencilSquare className='fs-4' /></Nav.Link>
            {/* 登入 */}
            <div>
              {isLoggedIn ? (
                <>
                  <Image
                    src="src/data/images/avatar_1.png"
                    roundedCircle
                    className="me-2"
                    style={{ width: '2rem', height: '2rem', }}
                  />
                  <span className="fs-5 me-4" style={{ verticalAlign: 'bottom' }}>{sessionData.username} </span>
                  <Button
                    onClick={handleLogout}
                    variant="outline-secondary"
                    className="rounded-pill shadow-sm px-3 custom-clear-button"
                  >登出
                  </Button>
                </>

              ) : (
                <>
                  <Nav.Link href="/login" className="fs-5 navbar-bottom">
                    登入
                  </Nav.Link>
                </>
              )}
            </div>



            {/* <NavDropdown title="LAink" id="navbarScrollingDropdown" className='fs-5 navbar-bottom'
            >
              <NavDropdown.Item href="#action3" >Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown> */}


            {/* <Nav.Link href="#" disabled>
              不顯示
            </Nav.Link> */}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;