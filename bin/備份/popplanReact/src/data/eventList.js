// src/data/eventList.js

const generateRandomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date(2025, 4, 1);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString(); // Full ISO format for DateTime
};

const statuses = ['報名', '結束'];
const tagPool = ["週一","週二","週三","週四","週五","週六","週日", "免費", "付費", "北部", "中部", "南部", "東部", "離島", "線上",
  "樂團", "桌遊", "偶像", "KTV", "美食", "運動", "展覽", "DIY", "語言", "學習",
  "動漫", "Cosplay", "宗教", "戶外", "寵物", "志工", "揪團"];

// 隨機選出不重複的 tag
const getRandomTags = () => {
  const shuffled = [...tagPool].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 4) + 1; // 1 到 4 個 tag
  return shuffled.slice(0, count);
};

const eventList = Array.from({ length: 150 }, (_, index) => {
  const randomImageIndex = Math.floor(Math.random() * 3) + 1;
  const tags = getRandomTags();
  const mainTag = tags[0];

  return {
    id: index + 1,
    title: `${mainTag}活動 ${index + 1}`,
    tags,
    description: `[${tags.join(', ')}] 這是一場很棒的活動，歡迎參加！這是一場很棒的活動，歡迎參加！這是一場很棒的活動，歡迎參加！這是一場很棒的活動，歡迎參加！`,
    image: `src/data/images/popular_${randomImageIndex}.jpg`,
    start_time: generateRandomDate(),
    max_participants: (Math.floor(Math.random() * 5) + 1) * 10, // 10 ~ 50
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
});

// 排序：日期新 → 舊
eventList.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

export default eventList;
