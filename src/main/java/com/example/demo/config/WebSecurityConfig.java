package com.example.demo.config;

import com.example.demo.filter.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration // 標註這是一個 Spring 配置類別
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("安全機制 filterChain 調用了");

        /*
		 * 這告訴 Spring Security「這些路徑不需要驗證，可以不帶 token 就能訪問」。
		 * 門2：Spring Security 授權機制
			這是第二道門，負責判斷「你是否被授權能進入這個資源」。
			這裡的設定就是告訴系統：			
			哪些路徑是「所有人都能進」，不需要授權（permitAll()），即使你沒帶 JWT 也沒關係。			
			哪些路徑需要授權，也就是必須帶 token，經過認證後才能訪問。
		 */
        http
            .csrf(csrf -> csrf.disable()) // 關閉 CSRF 防護（API 通常不需要）
            .cors(cors -> {})             // 啟用 CORS，允許跨域請求（具體規則沒寫，使用預設）
            .sessionManagement(session -> session
            		//明確禁止 Spring 建立 Session 覆蓋掉我原始的session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // <==  不要自動清除我的session
                )

            // 設定授權規則，判斷用戶是否可以訪問特定路由
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(          		// 指定多個路由，這些路由設為公開，不需帶 JWT 即可訪問
                    "/user/login/**",			//登入
                    //"/user/logout",
                    "/user/register/**",		//註冊
                    "/user/login/session",		//確認存續
                    "/user/authcode",			//驗證碼
                    "/event/**", 				//首頁 和單頁
                    "/websocket/**",			//通道
                    "/registration/status/**",  //活動單頁 頁面初始話 不用token
                    "/api/chat/**",				//通道 活動單頁
                    "/chat/ask",
                    "/email/**",
                    "/popplanllm/**"  			//agent的路由 8081就已經驗證過了
                    
                ).permitAll()              		// 允許所有人訪問上述路由

                .anyRequest().authenticated()  	// 除了上面列出的路由，其他路由都需要「認證」(即帶有效 JWT)
            )
            
            // 把自訂的 JwtAuthenticationFilter 加到 UsernamePasswordAuthenticationFilter 之前
            // JwtAuthenticationFilter 負責驗證 JWT 並設定使用者身份
         // **自訂 logout 行為，不跳轉，直接回 JSON**
            .logout(logout -> logout
                .logoutUrl("/user/logout")  // 指定登出 URL，跟你的前端呼叫路徑要一致
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"status\":200,\"message\":\"登出成功\"}");
                    response.setStatus(HttpServletResponse.SC_OK);
                })
                .deleteCookies("JSESSIONID") // 可以一起刪除 Session Cookie
                .invalidateHttpSession(true) // 清除 session
            )
            .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build(); // 建立並回傳 SecurityFilterChain 物件
    }
}


