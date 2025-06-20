import { createContext, useState, useEffect } from "react";
import { API_HOST } from '../UrlApi/urlapi';

//容器機制 必須要一次匯出兩個功能變數 所以不會看到以前的格式
//1.Context自身
export const SessionContext = createContext();

//2.自定義的session確認 要共享出去的  children代表子組件
export const SessionProvider = ({ children }) => {
  // session的 user容器
  const [user, setUser] = useState(null);
  // 登入狀態
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 加載狀態 防止filter過塊判斷fetch瞬間的 isLoggend false
  const [isLoading, setIsLoading] = useState(true); // 新增
  // 新增token狀態
  const [token, setToken] = useState(() => localStorage.getItem('jwtToken'));

  const sessionURL = `${API_HOST}/user/login/session`;
  //請求核心代碼
  const fetchSession = async () => {
    try {
      const res = await fetch(sessionURL, {
        method: 'GET',  //默認是GET 但我想寫
        credentials: 'include' //允許session
      })
      if (!res.ok) throw new Error('瀏覽器API失敗'); //提早拋出 因為後端都是ok回應

      const resData = await res.json(); //獲取ResponseEntity
      console.log(resData)
      if (resData.status == 200 && resData.data) { //查詢成功 由後端提取session 用回應送回來
        setUser(resData.data);
        setIsLoggedIn(true);
      } else { //非200 就維持  業務層錯誤
        console.log('業務層錯誤')
        setUser(null);

        setIsLoggedIn(false);
      }
    } catch (err) { //瀏覽器錯誤 網路層錯誤
      console.log('網路層錯誤')
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false); // 最後要標記為載入完成
    }
  }
  // 新增：token變化時印出方便debug
  useEffect(() => {

    if (token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
  }, [token]);

  //---副作用加載----------------------------
  useEffect(() => {

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ user, isLoggedIn, setUser, setIsLoggedIn, token, setToken, isLoading, fetchSession }}>
      {children}
    </SessionContext.Provider>
  );
}
