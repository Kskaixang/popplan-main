import { useContext } from "react";
// Outlet 巢狀Route 物件
import { Navigate, Outlet } from "react-router-dom";
import { SessionContext } from "./Provider/SessionProvider";
//不知道說 按鈕能不能也套用
const FilterRoute = () => {

  const { isLoggedIn, isLoading } = useContext(SessionContext);

  if (isLoading) {
    return null; // 或者 return null; 先不要做任何跳轉
  }

  if (!isLoggedIn) {
    alert('跳轉至登入頁，請先登入');
    return <Navigate to="/login" replace />;  //先化簡 我只是要先彈框
  }

  return <Outlet />;
}
export default FilterRoute;

//如果你有權限 ~ 這邊要在多重過濾