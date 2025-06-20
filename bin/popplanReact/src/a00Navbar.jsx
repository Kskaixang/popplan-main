import { Navbar, Nav, Form, Container, Button, Image } from 'react-bootstrap';

import { useContext } from 'react';
import { BsHeart, BsBell, BsPencilSquare, BsPlusSquare, BsClockHistory } from 'react-icons/bs'; // 引入放大鏡圖示

import { SessionContext } from './components/Provider/SessionProvider';


function NavScrollExample() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // 登入狀態

  //const [sessionData, setSessionData] = useState(null); //session 我舊有的 似乎可以淘汰了
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useContext(SessionContext); //共享容器
  //刷新活動 (目的是為了讓所有活動回到false狀態)


  //登出 清除session 的GET請求
  const handleLogout = async () => {
    console.log('0.現在的isLoggedIn' + isLoggedIn);
    try {
      const res = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        credentials: 'include'
      });
      const resdata = await res.json();
      console.log(resdata);

      setIsLoggedIn(false);
      if (resdata.status == 200) {
        setUser(null);
        setIsLoggedIn(false);
        console.log('1.現在的isLoggedIn' + isLoggedIn);
        alert('登出成功');

      } else {
        console.log('2.現在的isLoggedIn' + isLoggedIn);
        alert(`登出異常：${resdata.message}`);
      }
      // ✅ 清空登入狀態

    } catch (err) {
      console.log('3.現在的isLoggedIn' + isLoggedIn);
      console.error("登出失敗", err);
      alert('登出請求失敗');
    }


  };

  return (
    // sticky是 BootStrapt提供的 固定浮窗 且保留原本位置 但要注意 更高層級不能有overflow: hidden; position: relative; 會讓渲染無效
    <Navbar sticky="top" expand="lg" style={{ backgroundColor: '#e3f2fd', boxSizing: 'border-box', }}>
      <Container >
        {/* LOGO首頁區  照理說要利用as={Link} to="/"  不加載特性 但因為我沒有規劃很好 還是需要a的重新加載*/}
        <Navbar.Brand href="/" className="fw-bold text-primary d-none d-md-block p-0 me-2">
          PopPlan
        </Navbar.Brand>
        <Navbar.Brand href="/" className="fw-bold text-primary d-md-none p-0 me-2">
          PP
        </Navbar.Brand>


        {/* 不知道 */}
        <Navbar.Toggle aria-controls="navbarScroll" />
        {/* 漢堡 */}
        <Navbar.Collapse id="navbarScroll">

          {/* 舊版靠左<Nav className="ms-5 me-auto my-2 my-lg-0 gap-4 "> */}
          <Nav className="justify-content-end flex-grow-1 pe-3 gap-4 ">

            {/* 創建 */}
            <Nav.Link href="/Eventform" className='fs-5 navbar-bottom' >建立活動 <BsPlusSquare className='fs-4' /></Nav.Link>
            {/* 自己活動 */}
            <Nav.Link href="/myCreatedEvents" className='fs-5 navbar-bottom'>建立紀錄 <BsPencilSquare className='fs-4' /></Nav.Link>


            {/* 收藏報名 */}
            <Nav.Link href="/FavoriteEvent" className='fs-5 navbar-bottom'>
              <div className="d-flex align-items-center">
                <span className="me-2">收藏報名</span>
                {/* 包裹愛心 & badge 用來相對定位 */}
                <div className="position-relative">
                  <BsHeart className="fs-4" />
                  {/* user必須存在 && 數值必須大於0 && 顯示 */}
                  {user && user.favoriteCount > 0 && (
                    <span className="position-absolute badge rounded-pill bg-danger ">
                      {user.favoriteCount > 99 ? '99+' : user.favoriteCount}
                    </span>
                  )}
                </div>
              </div>
            </Nav.Link>
            {/* 報名紀錄 */}
            <Nav.Link href="/order" className='fs-5 navbar-bottom'>報名紀錄 <BsClockHistory className='fs-4' /></Nav.Link>
            {/* 通知 */}
            {/* <Nav.Link href="/Eventform" className='fs-5 navbar-bottom'>通知 <BsBell className='fs-4' /></Nav.Link> */}
            <Nav.Link href="/notification" className='fs-5 navbar-bottom'>
              <div className="d-flex align-items-center">
                <span className="me-2">通知</span>
                {/* 包裹愛心 & badge 用來相對定位 */}
                <div className="position-relative">
                  <BsBell className="fs-4" />
                  {/* user必須存在 && 數值必須大於0 && 顯示 */}
                  {user && user.notificationCount > 0 && (
                    <span className="position-absolute badge rounded-pill bg-danger">
                      {user.notificationCount > 99 ? '99+' : user.notificationCount}
                    </span>
                  )}
                </div>
              </div>
            </Nav.Link>


            {/* 登入 */}
            <div>
              {isLoggedIn ? (
                <>
                  <Image
                    src="/images/avatar_1.png"
                    roundedCircle
                    className="me-2"
                    style={{ width: '2rem', height: '2rem', }}
                  />
                  <span className="fs-5 me-4" style={{ verticalAlign: 'bottom' }}>{user?.username} </span>
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