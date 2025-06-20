
import { useState } from 'react'


//老師的寫法
function App() {

  const [todos, setTodos] = useState([
    { id: 1, text: '吃早餐', completed: false },
    { id: 2, text: '做體操', completed: true },
    { id: 3, text: '寫程式', completed: false }
  ]);
  const [todo, setTodo] = useState('');
  const [checkedList, setCheckedList] = useState([]); // 新增勾選狀態陣列

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTodoAdd();
    }
  }
  const handleTodoAdd = () => {
    //把裡面每個資料的ID 抓出來取最大值+1
    const newId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    const newTodo = { id: newId, text: todo, completed: false };

    setTodos([...todos, newTodo]);
    setTodo('')
  }

  const handleTodDelete = (id) => {
    //利用filter來過濾不需要的資訊資料
    //留下來的 是不等於此id的
    setTodos(todos.filter((todo) => todo.id !== id))

  }


  const toggleCompletion = (id) => {
    setTodos(
      //將傳入的id 對整個集合一一比對 一旦有 對todo.completed取反 如果沒有符合id 則回丟todo
      todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    )
  }




  return (
    <>
      <h4>課堂練習TodoList.jsx</h4>
      <div>
        <input type="text" value={todo} onChange={handleTodoChange} onKeyDown={handleKeyDown} />
        <button onClick={handleTodoAdd}>Send</button><p />


      </div>
      能力
      {/* className={`todo-item ${checkedList[index] ? 'checked' : ''}`}  */}
      <ul>
        {
          todos.map((todo) => (
            <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.id}
              <input type="checkbox" onChange={() => toggleCompletion(todo.id)} checked={todo.completed} />
              {todo.text}
              <button onClick={() => handleTodDelete(todo.id)}>  Delete</button>
            </li>
          ))
        }
      </ul>

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
