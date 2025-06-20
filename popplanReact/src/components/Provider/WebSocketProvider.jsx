import React, { createContext, useContext, useRef, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { SessionContext } from './SessionProvider';
import { toast } from 'react-toastify'; //通知框
import 'react-toastify/dist/ReactToastify.css';
import { API_HOST } from '../UrlApi/urlapi';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { isLoggedIn, user } = useContext(SessionContext);
  const userId = user?.userId;

  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    console.log('STOMP被觸發了 用戶是否有登入' + isLoggedIn + 'userId是' + userId)

    const socket = new SockJS(`${API_HOST}/websocket`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      // 整條 WebSocket 被關閉時（無論正常或異常）會被觸發。
      onWebSocketClose: (e) => {
        console.warn('🛑 WebSocket 掛了：', e);
        //toast.error('連線中斷，正在重新連線中...');
      },
      //開發時期確認
      //debug: undefined, // 上線後可直接移除，避免使用者 console log 被污染
      /*
        [STOMP] >>> CONNECT
        [STOMP] <<< CONNECTED version:1.2
        [STOMP] >>> SUBSCRIBE id:sub-0 destination:/topic/notification/1
        [STOMP] <<< MESSAGE destination:/topic/notification/1 message-id:xyz
        [STOMP] >>> SEND destination:/app/chat
      */
      debug: (msg) => console.log('[STOMP]', msg),

      // 預設是這兩個值(毫秒)，代表 client 發送給 server，server 發送給 client 的心跳間隔
      heartbeatIncoming: 10000,  // 期待 server 10秒內至少送一次心跳
      heartbeatOutgoing: 10000,  // client 每10秒送一次心跳給 server
    });

    client.onConnect = () => {
      console.log('✅ WebSocket 已連線');
      setConnected(true);

      client.subscribe(`/topic/notification/${userId}`, (message) => {
        const body = message.body;
        let msg;

        try {
          msg = JSON.parse(body); // 嘗試解析 JSON
        } catch {
          msg = body; // 如果解析失敗，當成純文字使用
        }

        console.log('🔔 通知:', msg);
        toast.info(typeof msg === 'string' ? msg : JSON.stringify(msg));
        // toast.info、toast.error、toast.success、toast.warning
        // TODO: 可以丟進通知 context / toast
      });
    };

    client.onStompError = (err) => {
      console.error('❌ STOMP 錯誤', err);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('🛑 WebSocket 已斷線');
      client.deactivate();
      setConnected(false);
    };
  }, [isLoggedIn, userId]);

  return (
    <WebSocketContext.Provider value={{ client: clientRef.current, connected }}>

      {children}

    </WebSocketContext.Provider>
  );
};

// 封裝好的 hook，元件中使用
export const useGlobalWebSocket = () => useContext(WebSocketContext);
