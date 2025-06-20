package com.example.demo.temp;

import java.io.IOException;
import java.util.Enumeration;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/user/logout")
public class UserLogoutServlet extends HttpServlet{ 
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		HttpSession session = req.getSession();		
		//自己亂家的
	    Enumeration<String> names = session.getAttributeNames();
	    while (names.hasMoreElements()) {
	        String name = names.nextElement();
	        Object value = session.getAttribute(name);
	        System.out.println(name + " = " + value);
	    }
		//自己亂加的
		
		
		session.invalidate(); //得到session後 將裡面的東西都失效
		
		
		//登出後 仍然會到 login 所以設計是一樣得
		req.getRequestDispatcher("/WEB-INF/view/cart/user_login.jsp").forward(req, resp);
	}
	

}
