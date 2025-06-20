import { useState } from 'react';
import { Navbar, Container, Form, FormControl, Button, Nav, Offcanvas, Image } from 'react-bootstrap';
import { BsPencil, BsHeart, BsClock, BsPersonCircle, BsSearch } from 'react-icons/bs'; // 引入放大鏡圖示
import { Link } from "react-router-dom";
function NavigationBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登入狀態
  const [notificationCount, setNotificationCount] = useState(5); // 假設收藏報名有5個通知
  const [showSearch, setShowSearch] = useState(false); // 控制搜尋框顯示

  return (
    <>

      <Navbar expand="md" className="py-3" style={{ backgroundColor: '#e3f2fd', boxSizing: 'border-box' }}>
        <Container fluid>

          {/* LOGO首頁區 */}
          <Link to="/">
            <Navbar.Brand href="#" className="fw-bold text-primary d-none d-md-block p-0 me-2">
              PopPlan
            </Navbar.Brand>
            <Navbar.Brand href="#" className="fw-bold text-primary d-md-none p-0 me-2">
              PP
            </Navbar.Brand>
          </Link>

          {/* 搜尋框 */}
          <div className="d-md-flex align-items-center">
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="搜尋活動"
                aria-label="Search"
              />
              <Button variant="outline-success"><BsSearch /></Button>
            </Form>
          </div>


          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas id="offcanvasNavbar" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title >選單</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {/* 創建活動入口 */}
                <Nav.Link href="/Eventform" className='navbar-bottom g-3' >
                  創建活動 <BsPencil className="me-2" />
                </Nav.Link>
                <span className="pe-2">.</span>
                {/* 收藏報名入口 */}
                <Nav.Link href="/registrations" className='d-flex gap-1 navbar-bottom'>
                  <span>收藏報名 </span>
                  <div className="relative">
                    <BsHeart className="me-1" />
                    {notificationCount > 0 && (
                      <span className="badge bg-danger absolute top-negative-1  start-50">{notificationCount}</span>
                    )}
                  </div>

                </Nav.Link>
                <span className="pe-2">.</span>
                {/* 歷史紀錄入口 */}
                <Nav.Link href="/events" className="navbar-bottom">
                  歷史紀錄 <BsClock />
                </Nav.Link>
                <span className="pe-2">.</span>
                {/* 登入 / 註冊或用戶選單 */}
                {isLoggedIn ? (
                  <Nav.Link href="/login" >
                    <Image
                      src="https://via.placeholder.com/40"
                      roundedCircle
                      className="me-2"
                    />
                    用戶
                  </Nav.Link>
                ) : (
                  <>
                    <Nav.Link href="/login" onClick={() => setShowLogin(true)} className="navbar-bottom">
                      登入
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;