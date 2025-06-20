import { useState } from 'react';
import AIChatStreaming from './components/AIChatStreaming';

import {
  Container, Row, Col, Form, Button, InputGroup, FormControl
} from 'react-bootstrap';

const tagGroups = {
  時間: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
  地區: ["北部", "中部", "南部", "東部", "離島", "線上"],
  活動: ["樂團", "桌遊", "偶像", "KTV", "美食", "運動", "展覽", "DIY", "語言", "學習", "動漫", "Cosplay", "宗教", "戶外", "寵物", "志工", "揪團"]
};

function CreateEventPage() {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null); // 加這個
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [status] = useState('DRAFT'); // 僅創建階段使用，後續視情況開放修改
  const [aiChatStreaming, setAiChatStreaming] = useState('');

  const [showAiBox, setShowAiBox] = useState(false);

  const [selectedTags, setSelectedTags] = useState({
    時間: '',
    地區: '',
    活動: ''
  });
  const [mainTag, setMainTag] = useState('');
  const [customTags, setCustomTags] = useState(["", "", "", ""]);
  const [systemTags, setSystemTags] = useState([]); // ← 程式自動控制的 免費 tag
  //總TAG
  const getFinalTags = () => {
    const selected = Object.values(selectedTags).filter(tag => tag); // ["週末", "台北"]
    const custom = customTags.filter(tag => tag.trim() !== ""); // ["親子", "戶外"]
    const system = isFree ? ["免費"] : [];

    const allTags = [...selected, mainTag, ...custom, ...system].filter(tag => tag); // 移除空值
    return allTags;
  };


  //AI區間
  const generateAiText = () => {
    const selectedTagText = Object.entries(selectedTags)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('、');

    const mainTagText = mainTag ? `主題: ${mainTag}` : '';

    //偷懶"免費"直接加進去
    const customTagText = '元素: ' + (isFree ? '免費、' : '') + customTags
      .filter((tag) => tag && tag.trim() !== '')
      .join('、');

    const combinedText = [selectedTagText, mainTagText, customTagText]
      .filter((text) => text)
      .join('\n');

    setAiChatStreaming(combinedText);
    setShowAiBox(prev => !prev); // 顯示對話框
  };
  //AI區間底



  const handleCustomTagChange = (index, value) => {
    const updatedTags = [...customTags];
    updatedTags[index] = value;
    setCustomTags(updatedTags);
  };

  const handleTagChange = (group, value) => {
    setSelectedTags({ ...selectedTags, [group]: value });
  };
  //POST表單送出start
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalTags = getFinalTags(); // 取得標籤陣列（例如 ['台北', '攝影']）

    // 組成事件的 JSON 資料
    const eventData = {
      title,
      description,
      location,
      startTime,
      maxParticipants,
      price,
      status,
      tags: finalTags,
    };

    try {
      const formData = new FormData(); // 建立 FormData 物件，能同時包 JSON 和檔案

      // 將事件 JSON 包成 Blob，加到 FormData 裡（後端用 @RequestPart("event") 解析）
      formData.append(
        "event",
        new Blob([JSON.stringify(eventData)], { type: "application/json" })
      );

      // 如果你有上傳圖片檔案（imageFile 是用 useState 保存的原始 file 物件）
      if (imageFile) {
        formData.append("image", imageFile); // 後端用 @RequestPart("image") 接收
      }

      // 發送 multipart/form-data POST 請求
      const res = await fetch("http://localhost:8080/event", {
        method: "POST",
        body: formData, // 不要自己設定 Content-Type，fetch 會自動處理 boundary
      });

      const resData = await res.json();
      console.log(resData);

      if (res.ok && resData.status === 200) {
        alert(resData.message || "事件已成功創建！");
      } else {
        alert(`錯誤: ${resData.message || "無法創建事件(也無收到 JSON)"}`);
      }
    } catch (err) {
      alert("請先登入");
    }

    //   if (!response.ok) throw new Error(response);
    //   //拿到@Valid 的錯誤訊息
    //   const resData = await response.json();
    //   // console.log(resData);
    //   // console.log(resData.status);
    //   // console.log(resData.message);
    //   if (resData.status == 201) {
    //     // setForm({ roomId: '', roomName: '', roomSize: '' })
    //     // fetchRooms();
    //     // setIsEditing(false); // 解除編輯模式
    //   } else {
    //     alert('表單傳送失敗:' + resData.message);
    //   }

    // } catch (err) {
    //   //瀏覽器自身的錯誤訊息
    //   console.log('表單傳送失敗:', err.message);
    //   alert('表單傳送失敗:' + err.message);
    // }


  };

  //Post表單送出End

  //更換預覽圖
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setImageFile(file); // 存起來
    }
  };



  return (

    <Container className="mt-4 p-4 border border-gray bg-white shadow rounded">
      <h2>創建活動</h2>

      {/* returnTAG區start */}
      <Row>
        <Form.Label>標籤Tag</Form.Label>
        {Object.entries(tagGroups).map(([group, options]) => (
          <Col xs={6} md={3} key={group}>
            <Form.Select className="mb-2"
              value={selectedTags[group] || ''}
              onChange={(e) => handleTagChange(group, e.target.value)}
            >
              <option value="">選擇{group}</option>
              {options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </Form.Select>
          </Col>
        ))}
        <Col xs={6} md={3}>
          <Form.Control
            type="text"
            placeholder="主題tag（必填）"
            value={mainTag}
            onChange={(e) => setMainTag(e.target.value)}
            required
          />
        </Col>
      </Row>

      <Row className="mb-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Col key={index} xs={6} md={3}>
            <InputGroup className="mb-2">
              <FormControl
                placeholder="自訂（選填）"
                value={customTags[index] || ""}
                onChange={(e) => handleCustomTagChange(index, e.target.value)}
              />
            </InputGroup>
          </Col>
        ))}
      </Row>
      {/* returnTAG區end */}

      <Row>
        <Col md={3}>
          {/* 金額start */}
          <div className="d-flex align-items-center mb-2">
            {/* 報名費用標籤 */}
            <Form.Label className="me-3 mb-0">報名費用</Form.Label>

            {/* 免費選項 */}
            <Form.Check
              type="checkbox"
              label="免費"
              checked={isFree}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsFree(checked);
                setPrice(0);
                setSystemTags((prev) => {
                  const filtered = prev.filter(tag => tag !== "免費");
                  return checked ? [...filtered, "免費"] : filtered;
                });
              }}
              className="mb-0"
            />
          </div>



          {/* 金額框 */}
          <InputGroup className='mb-4 '>
            <Form.Control
              type="number"
              placeholder="請輸入金額"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={isFree}
              className='text-end'
            />
            <InputGroup.Text>
              {isFree ? '免費活動' : '元'}
            </InputGroup.Text>
          </InputGroup>
          {/* 金額end */}
        </Col>
        <Col md={9}>
          <Form.Group className="mb-3">
            <Form.Label>活動地點</Form.Label>
            <Form.Control
              type="text"
              placeholder="活動地點"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>




      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6} className="mx-auto">
            <div className="border p-3 mb-2 text-center bg-light" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="預覽圖"
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <p style={{ margin: 0, color: '#888' }}>請上傳圖片</p>
              )}
            </div>
            <Form.Control
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>活動標題</Form.Label>
          <Form.Control
            type="text"
            placeholder="活動標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Label>
            活動介紹
            <Button
              onClick={generateAiText}
              variant="outline-secondary"
              className="custom-clear-button ms-3"
              style={{ backgroundColor: showAiBox ? '#D1E9E9' : '#e3f2fd' }}
            >{showAiBox ? '收起 AI 小幫手' : '啟動 AI 小幫手'}
            </Button>

          </Form.Label>

          {/* 當 showAiBox 為 true 時顯示對話框和送出按鈕 */}
          {showAiBox && (

            <div className="mb-3">
              <AIChatStreaming
                setDescription={setDescription}
                aiChatStreaming={aiChatStreaming}
              />

            </div>
          )}
          <Form.Control
            style={{ height: "400px" }}
            as="textarea"
            placeholder="活動介紹"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>



        <Row className="mb-3">
          <Col md={4}>
            <Form.Label>活動開始日期</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </Col>
          <Col md={4}>
            <Form.Label>最大人數</Form.Label>
            <Form.Control
              min={5}
              required
              type="number"
              placeholder="最大人數"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Label>活動狀態</Form.Label>
            <Form.Select value={status} disabled>
              <option value="draft">草稿</option>
              <option value="published">已發布</option>
              <option value="completed">已結束</option>
              <option value="canceled">已取消</option>
            </Form.Select>
            {/* 僅創建階段為草稿，其他情境未來啟用 */}
          </Col>
        </Row>




        <Row className="mb-4">
          <Col md={6} className="d-flex align-items-center" >

          </Col>



        </Row>
        <Col md={12}>
          <Button
            type="submit"
            variant="outline-secondary"
            className="w-100 custom-clear-button"
          >
            創建活動
          </Button>
        </Col>
      </Form>
    </Container>
  );
}

export default CreateEventPage;
