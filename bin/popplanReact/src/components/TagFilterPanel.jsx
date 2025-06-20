import { Button } from "react-bootstrap";

function TagFilterPanel({ selectedTags, onTagToggle, onClearTags }) {
  const tagGroups = {
    時間: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
    地區: ["北部", "中部", "南部", "東部", "離島", "線上"],
    活動: ["樂團", "桌遊", "偶像", "免費", "付費", "KTV", "美食", "運動", "展覽", "DIY", "語言", "學習", "動漫", "Cosplay", "宗教", "戶外", "寵物", "志工", "揪團"]
  };

  return (
    <div>


      {Object.entries(tagGroups).map(([category, tags]) => (
        <div key={category} className="mb-3">
          <strong >{category}</strong>
          <div className="mt-1">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "primary" : "outline-secondary"}
                onClick={() => onTagToggle(tag)}
                className="me-2 mb-2 rounded-pill shadow-sm px-3"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TagFilterPanel;
