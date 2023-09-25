import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// const socket = io(
//   process.env.NEXT_PUBLIC_BASE_API_URL || 'http://192.168.1.9:3000',
// );

export const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   socket.on('chat message', (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });
  // }, []);
  //
  // const sendMessage = () => {
  //   socket.emit('chat message', message);
  //   setMessage('');
  // };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {/*<button onClick={sendMessage}>Send</button>*/}
    </div>
  );
};
