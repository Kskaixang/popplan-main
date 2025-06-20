import './App.css'
import { useState } from 'react'



function App() {
  const [ability, setAbility] = useState('');
  const [abilitys, setAbilitys] = useState([]);
  const [checkedList, setCheckedList] = useState([]); // 新增勾選狀態陣列

  const handleInputChange = (e) => {
    setAbility(e.target.value);
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAbility();
    }
  }
  const handleAbility = () => {
    setAbilitys([...abilitys, ability]);
    setCheckedList([...checkedList, false]); // 新增勾選
    setAbility('')
  }

  const handleCheckboxChange = (index) => {
    const updated = [...checkedList];
    updated[index] = !updated[index]; // 切換狀態
    setCheckedList(updated);
  }


  return (
    <>
      <h4>課堂練習TodoList.jsx</h4>
      <div>
        <input type="text" value={ability} onChange={handleInputChange} onKeyDown={handleKeyDown} />
        <button onClick={handleAbility}>Send</button><p />


      </div>
      能力
      <ol>
        {
          abilitys.map((ability, index) => (
            <li className={`todo-item ${checkedList[index] ? 'checked' : ''}`} key={index} >
              <input type="checkbox" checked={checkedList[index]} onChange={() => handleCheckboxChange(index)} />
              {index + 1}: {ability}</li>
          ))
        }
      </ol>

      <p />.
      <p />.
      <p />.
      <p />.
      <p />.
      <p />.
      <p />----------------

    </>
  )
}
export default App
