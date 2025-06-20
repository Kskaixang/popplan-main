package com.example.demo.filter;

import java.io.IOException;

import org.springframework.boot.web.servlet.ServletComponentScan;

import com.example.demo.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
//你要去主頁.java 上註解@ServletComponentScan //啟用WebFilter 掃描 因為SpringBoot 預設會忽略JAVAweb基本的 使用了自己的Filter 所以要取代 取用
@WebFilter(urlPatterns = {"/rest/room/*", "/rest/rooms/*"}) // 需要登入才能訪問的路徑,"/event"
public class LoginRestFilter extends HttpFilter {

	@Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String method = request.getMethod(); // 取得 HTTP 方法（例如 GET、POST、PUT、DELETE）

        // 如果是 GET 方法（查詢資料），直接放行，不檢查登入
        if ("GET".equalsIgnoreCase(method)) {
            chain.doFilter(request, response); // 放行後續處理（Controller 或下一個 Filter）
            return;
        }

        // 嘗試取得 session（若瀏覽器有帶 JSESSIONID 就會自動取得對應 session；否則會新建一個）
        HttpSession session = request.getSession();

        //如果 session 存在，且有 userCert 屬性（代表已登入）        
        if (session != null && session.getAttribute("userCert") != null) {
            chain.doFilter(request, response); // 已登入，放行
        } else {
            //沒登入：回傳 HTTP 401 Unauthorized

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 設定 HTTP 狀態碼為 401

            response.setContentType("application/json;charset=UTF-8"); // 設定回傳類型為 JSON（含 UTF-8 編碼）

            // 用自訂的 ApiResponse 類別產生錯誤訊息物件（類似通用回應格式）
            ApiResponse<?> apiResponse = ApiResponse.error(401, "請先登入");

            // ⭐ 使用 Jackson 的 ObjectMapper 將 Java 物件轉換為 JSON 字串
            ObjectMapper mapper = new ObjectMapper();
            String json = mapper.writeValueAsString(apiResponse); // 轉為 JSON 字串

            response.getWriter().write(json); // 輸出 JSON 到回應流
        }
    }
}