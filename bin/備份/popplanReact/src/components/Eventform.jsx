// src/components/EventForm.jsx
import { useState } from 'react';

function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        alert('活動已提交');
      })
      .catch(error => {
        console.error('提交失敗:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>活動標題：</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>活動描述：</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit">提交活動</button>
    </form>
  );
}

export default EventForm;
