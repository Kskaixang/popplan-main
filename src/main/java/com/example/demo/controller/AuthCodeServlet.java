package com.example.demo.controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

import javax.imageio.ImageIO;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


@RestController
@CrossOrigin(origins = "http://localhost:5173") // 允許來自 React 開發伺服器的跨域請求
//@CrossOrigin(origins = {"http://localhost:5173","http://10.100.53.3:5173"}, allowCredentials = "true") // 允許來自 React 開發伺服器的跨域請求
public class AuthCodeServlet extends HttpServlet {
	
	// 自訂認證碼 0~9 a-z A-Z
	private String generateAuthCode() {
		String chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		StringBuffer authcode = new StringBuffer();
		Random random = new Random();
		for(int i=0;i<4;i++) {
			int index = random.nextInt(chars.length()); // 隨機取位置
			authcode.append(chars.charAt(index)); // 取得該位置的資料
		}
		return authcode.toString();
	}
	//自訂驗證碼
	@GetMapping("/user/authcode")
	public void creactAuthCode(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Random random = new Random();
		//"%04d"  4位數 不足4位 會補0
		String authcode = String.format("%04d", random.nextInt(10000)); // 0000~9999 的隨機數
		//String authcode = generateAuthCode();  //老師的 混和英文
		
		// 將 authcode 存入到 HttpSession 屬性中
		HttpSession session = req.getSession();
		session.setAttribute("authcode", authcode);		
		//getOutputStream非文字的串流輸出;
		ImageIO.write(getAuthCodeImage(authcode), "JPEG", resp.getOutputStream());
		resp.getOutputStream().close();
	}
	
	//利用JAVA 2D 產生動態圖像
	private BufferedImage getAuthCodeImage(String authcode) {
		// 建立圖像區域(80x30 TGB)
		BufferedImage img = new BufferedImage(80, 30, BufferedImage.TYPE_INT_RGB);
		// 建立畫布
		Graphics g = img.getGraphics();
		// 設定顏色
		g.setColor(Color.YELLOW);
		// 塗滿背景
		g.fillRect(0, 0, 80, 30); // 全區域
		// 設定顏色
		g.setColor(Color.BLACK);
		// 設定字型
		g.setFont(new Font("Segoe UI Emoji", Font.BOLD, 22)); // 字體, 風格, 大小
		// 繪文字
		g.drawString(authcode, 18, 22); // (18, 22) 表示繪文字左上角的起點
		//加上紅色干擾線
		g.setColor(Color.RED);
		Random random = new Random();
		for(int i = 0; i < 15 ; i++) {
			int x1 = random.nextInt(80); //0~79
			int y1 = random.nextInt(30); //0~79
			int x2 = random.nextInt(80); //0~79
			int y2 = random.nextInt(30); //0~79
			//繪製直線
			g.drawLine(x1, y1, x2, y2);
		}
		
		
		
		return img;
	}
	

}
