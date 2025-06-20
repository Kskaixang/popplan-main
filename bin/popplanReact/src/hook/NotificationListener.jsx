import useNotificationSocket from '../hooks/useNotificationSocket';

const NotificationListener = ({ userId, isLoggedIn }) => {
  useNotificationSocket(userId, isLoggedIn, (msg) => {
    // ✅ 這邊你要怎麼顯示都行，這是接收到的訊息
    console.log('📬 收到通知：', msg);

    // 例如：彈出 toast、更新 UI 狀態、紅點、彈窗等
    // alert(`通知：${msg.content}`);
  });

  return null; // 這只是負責訂閱，不需要畫面
};

export default NotificationListener;
