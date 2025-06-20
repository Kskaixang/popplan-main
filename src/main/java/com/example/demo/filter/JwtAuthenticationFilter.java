package com.example.demo.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // System.out.println("JwtAuthenticationFilter.doFilterInternal 執行中"); // Debug: 進入 filter 方法

        // 取得 HTTP 請求的 Authorization header
        String authHeader = request.getHeader("Authorization");
        // System.out.println("Authorization header: " + authHeader); // Debug: 顯示 Authorization header

        // 判斷 header 是否存在且是否以 "Bearer " 開頭
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 去除 "Bearer " 前綴，取得純 token 字串
            String jwt = authHeader.substring(7);
            // System.out.println("JWT Token (raw): " + jwt); // Debug: 顯示 token

            // 用 '.' 拆解 JWT token（分成 header.payload.signature 三部分）
            String[] parts = jwt.split("\\.");
            if (parts.length == 3) {
            } else {
                // System.out.println("Token 格式異常，應有三段"); // Debug: token格式錯誤
            }

            try {
                // 呼叫 SecurityConfig 的驗證方法驗證 token 是否有效
                boolean valid = JwtUtil.validateToken(jwt);
                // System.out.println("Token 驗證結果: " + valid); // Debug: 顯示驗證結果

                if (valid) {
                    // 取得 token 中的 username 或 userid
                    String userid = JwtUtil.getUsernameFromToken(jwt);
                    // System.out.println("從 token 取得 userid: " + userid); // Debug: 顯示 userid

                    // 建立認證物件 (Principal, Credentials, Authorities)
                    UsernamePasswordAuthenticationToken authentication =
                    		//代表誰登入的（通常是帳號或用戶 ID）   ,   登入憑證（密碼），但 JWT 不需要   ,   使用者擁有的權限（如 ROLE_USER）
                            new UsernamePasswordAuthenticationToken(userid, null, null);
                    // 將認證物件設置到 SecurityContext 中，完成身份認證
                    SecurityContextHolder.getContext().setAuthentication(authentication);                    
                } else {
                }
            } catch (Exception e) {
                // System.out.println("驗證 token 發生例外: " + e.getMessage()); // Debug: 異常訊息
                // e.printStackTrace(); // Debug: 列印例外堆疊訊息
            }
        } else {
            // System.out.println("Authorization header 不存在或格式不正確"); // Debug: header 不存在或格式錯誤
        }

        // 放行，讓後續的過濾器或 Servlet 繼續處理請求
        filterChain.doFilter(request, response);
        // System.out.println("JwtAuthenticationFilter.doFilterInternal 結束"); // Debug: filter 結束
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String authHeader = request.getHeader("Authorization");

        String path = request.getRequestURI();
        // 設定哪些路徑不經過 JWT 過濾器，避免重複驗證
        /*
         * 這是用來告訴 Spring Security 的過濾器「這些路徑不需要套用這個 JWT Filter（JwtAuthenticationFilter）」。
如			果這個方法回傳 true，filter 就不會執行，也就是不檢查 JWT。
			門1：JWT 過濾器（Filter）
			這是入口第一道門，負責檢查「你有沒有帶有效的 JWT」，如果你帶了有效的 JWT，就放你進來，沒有帶或者不對就攔下來。
			如果門1判斷「你這個請求是免檢查 JWT 的路徑」（shouldNotFilter 回傳 true），那它就直接不攔截，放你直接過門。
         */
        boolean noFilter = path.startsWith("/user/login") 
                || path.startsWith("/user/register") 
                //|| path.equals("/user/login/logout")
                || path.equals("/user/login/session")
                || path.startsWith("/user/authcode")
                || path.startsWith("/event") 
                || path.startsWith("/websocket") 
                || path.startsWith("/registration/status")
                || path.startsWith("/api/chat")  //通道 活動單頁
                || path.startsWith("/chat/ask") 
                || path.startsWith("/email")                 
                || path.startsWith("/popplanllm")  //agent的路由 全都由8081管理
                || "websocket".equalsIgnoreCase(request.getHeader("Upgrade"));

        // System.out.println("是否跳過 JWT 過濾器: " + noFilter); // Debug: 顯示是否跳過
        return noFilter; // 回傳是否跳過過濾器
    }
}
