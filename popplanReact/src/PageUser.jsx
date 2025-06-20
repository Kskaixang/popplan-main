import { Container } from 'react-bootstrap';
import CalendarWithTodo from './components/Calendar/Calendar.jsx';
//國際語言
import { CustomProvider, Calendar } from 'rsuite';
import zhTW from 'rsuite/locales/zh_TW';

function UserPage() {
  return (
    <CustomProvider locale={zhTW}>
      <Container className="mt-4 p-4 border border-gray bg-white shadow rounded">
        <h5 className='mb-3'>我的行程</h5>
        <CalendarWithTodo />

      </Container>
    </CustomProvider>
  );
}

export default UserPage;
