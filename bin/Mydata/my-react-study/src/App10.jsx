// 子組件: 表頭
function StudentTableHeader() {
  return (
    <thead>
      <tr>
        <th>ID</th><th>name</th><th>score</th><th>pass</th>
      </tr>
    </thead>
  )
}

// 子組件: 表身
function StudentTableBody({ students }) {
  return (
    <tbody>
      {
        students.map((student) => {
          const isPass = (student.score >= 60) ? 'V' : 'X';
          return (

            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.score}</td>
              <td>{isPass}</td>
            </tr>
          )
        }
        )
      }
    </tbody>
  )
}

// 子組件: 表尾
function StudentTableFooter({ average }) {
  return (
    <tfoot>
      <tr>
        <td colSpan="2" align="right">平均分</td>
        <td align="right">{average.toFixed(1)}</td>
        <td></td>
      </tr>
    </tfoot>
  )
}

// 子組件: 主表
function StudentTable({ students, average }) {
  return (
    <table border="1">
      <StudentTableHeader />
      <StudentTableBody students={students} />
      <StudentTableFooter average={average} />
    </table>
  )
}


function App() {
  const students = [
    { id: 1, name: '小明', score: 55 },
    { id: 2, name: '小美', score: 78 },
    { id: 3, name: '小華', score: 92 },
    { id: 4, name: '阿強', score: 40 }
  ];
  const average = (students.reduce((sum, student) => sum + student.score, 0)) / students.length;

  /*
{id:1, name:'小明', score:55},
{id:2, name:'小美', score:78},
{id:3, name:'小華', score:92},
{id:4, name:'阿強', score:40},

顯示 table 樣式
id | name | score | pass
 1   小明    55      X 
 2   小美    78      V 
 3   小華    92      V 
 4   阿強    40      X 
全班平均: XX

試著拆分父子組件
*/
  return (
    <>
      <h4>APP10-學生列表</h4>
      <StudentTable students={students} average={average} />
    </>
  )
}
export default App
