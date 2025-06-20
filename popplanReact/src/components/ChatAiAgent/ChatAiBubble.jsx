import './ChatAiBubble.css';

const ChatBubble = ({ message, isSelf, time, username }) => {
  return (
    <div className={`chatAi-bubble ${!isSelf ? 'selfAi' : 'otherAi'}`}>
      <div className="bubbleAi-content">
        {message.content}
      </div>
      <div className="bubbleAi-time">{time}</div>
    </div>
  );
};

export default ChatBubble;
