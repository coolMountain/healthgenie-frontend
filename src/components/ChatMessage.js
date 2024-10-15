// src/components/ChatMessage.js
import React from 'react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.sender}`}>
      {message.text}
    </div>
  );
};

export default React.memo(ChatMessage); // 使用 React.memo 优化性能
