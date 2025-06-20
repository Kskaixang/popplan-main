import { createContext, useState, useEffect } from "react";
import { API_HOST } from '../UrlApi/urlapi';

//容器機制 必須要一次匯出兩個功能變數 所以不會看到以前的格式
//1.Context自身
export const EventContext = createContext();

//2.自定義的session確認 要共享出去的  children代表子組件
export const EventProvider = ({ children }) => {
  // session的 user容器
  const [events, setEvents] = useState([]);
  // 加載狀態 防止filter過塊判斷fetch瞬間的 isLoggend false
  const [isLoading, setIsLoading] = useState(true); // 新增


  //請求核心代碼
  const fetchEvent = async () => {
    try {
      const res = await fetch(`${API_HOST}/event`, {
        method: 'GET',  //默認是GET 但我想寫
        credentials: 'include' //允許session 這裡 有顯示收藏狀態的需求
      })
      if (!res.ok) throw new Error('瀏覽器API失敗'); //提早拋出 因為後端都是ok回應

      const resData = await res.json(); //獲取ResponseEntity
      console.log(resData)
      if (resData.status == 200 && resData.data) { //查詢成功 由後端提取session 用回應送回來
        setEvents(resData.data);
      } else { //非200 就維持  業務層錯誤
        setEvents([]);
      }
    } catch (err) { //瀏覽器錯誤 網路層錯誤
      setEvents([]);
      console.log('瀏覽器發生錯誤' + err)
    } finally {
      setIsLoading(false); // 最後要標記為載入完成
    }

  }

  //---副作用加載----------------------------
  useEffect(() => {
    fetchEvent();
  }, []);

  return (
    <EventContext.Provider value={{ events, isLoading, fetchEvent }}>
      {children}
    </EventContext.Provider>
  );
}
