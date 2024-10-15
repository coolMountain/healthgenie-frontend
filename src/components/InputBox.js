// src/components/InputBox.js
import React from 'react';

const InputBox = ({ userInput, setUserInput, handleSendMessage, loading }) => {
  return (
    <div className="input-container">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Ask a medical question..."
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}  // 支持 Enter 键发送
      />
      <button onClick={handleSendMessage} disabled={loading}>Send</button>
    </div>
  );
};

export default InputBox;
