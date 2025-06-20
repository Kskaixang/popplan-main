const myfetch = async () => {
  try {
    const response = await fetch('http://localhost:8080/', {
      method: 'GET',   //你的Rest請求格式 可以是POST DELET PUT (method: 'GET'是默認 其實可以不寫)
      credentials: 'include'  //允許session 過來
    })
    if (!res.ok) throw new Error('瀏覽器請求API失敗')  //有狀況直接外拋給下面的catch

    const resData = await res.Json(); //這邊才是正式把你的ApiResponseEntity解析成JSON的地方

    if (resData.status == 200 && resData.data) { //只有 200 和 data<T>有內容物時才往下做
      console.log(res.data) //自定義怎麼使用 比如 setUser(res.data)
    } else { //如果不是 通常是你後端拋的例外被補捉到這裡 status == 500  RuntimeException之類
      alert(res.message)
    }


  } catch (err) {
    console.log('瀏覽器請求失敗')
  }
}
