import React, { useState, useEffect } from 'react';
import './App.css'; 
import { useTranslation } from 'react-i18next';
import './i18n'; // 导入配置的i18n

function App() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]); // 当前对话的聊天记录
  const [userInput, setUserInput] = useState(''); // 用户输入
  const [loading, setLoading] = useState(false); // 加载状态
  const [selectedCategory, setSelectedCategory] = useState(null); // 选择的类别
  const [isDarkMode, setIsDarkMode] = useState(false); // 夜间模式开关
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem('notificationsEnabled') === 'true'
  );
  const [chatHistory, setChatHistory] = useState([]); // 保存历史聊天记录
  const [showSettings, setShowSettings] = useState(false); // 设置弹窗显示状态
  const [showLanguageMenu, setShowLanguageMenu] = useState(false); // 语言菜单显示状态
  const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词

  // 预设提示词
  const presetPrompts = [
    '请问头疼应该怎么办？',
    '如何预防流感？',
    '高血压的症状有哪些？'
  ];

  // 当应用加载时，从 localStorage 加载历史记录
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    setChatHistory(storedHistory);
  }, []);

  // 保存当前聊天记录到历史记录
  const saveChatToHistory = () => {
    const newHistory = [...chatHistory, { id: Date.now(), messages }];
    setChatHistory(newHistory);
    localStorage.setItem('chatHistory', JSON.stringify(newHistory));
  };

  // 开始新对话时保存当前记录并重置聊天记录
  const startNewConversation = () => {
    if (messages.length > 0) {
      saveChatToHistory();
    }
    setMessages([]); // 清空当前对话
  };

  // 加载历史聊天记录
  const loadHistory = (id) => {
    const selectedChat = chatHistory.find((chat) => chat.id === id);
    if (selectedChat) {
      setMessages(selectedChat.messages); // 加载选中的历史聊天
    }
  };

  // 清除所有历史记录
  const clearHistory = () => {
    if (window.confirm(t('clear_history_confirm'))) {
      setChatHistory([]);
      localStorage.removeItem('chatHistory');
    }
  };

  // 发送消息并调用 ChatGLM3 API
  const handleSendMessage = async (inputText = userInput) => {
    if (!inputText.trim()) return;
    const userMessage = { sender: 'user', text: inputText, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: '你是一个专业的医疗助手，具备丰富的医学知识和医疗建议能力。' },
            { role: 'user', content: inputText }
          ],
        }),
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.choices[0]?.message?.content || "无法获取有效的响应", timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: '网络错误，请稍后再试。', timestamp: new Date() }]);
    }
    
    setLoading(false);
    setUserInput('');
  };

  // 处理点击预设提示词
  const handlePresetPromptClick = (prompt) => {
    setUserInput(prompt);
    handleSendMessage(prompt);
  };

  // 切换夜间模式
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 切换设置弹窗
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // 切换语言菜单
  const toggleLanguageMenu = () => {
    setShowLanguageMenu(!showLanguageMenu);
  };

  // 处理语言切换
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setShowLanguageMenu(false);
  };

  // 处理消息撤回
  const handleRecallMessage = (index) => {
    const newMessages = messages.filter((_, i) => i !== index);
    setMessages(newMessages);
  };

  // 处理语音输入（需要浏览器支持）
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('抱歉，您的浏览器不支持语音输入功能。');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
      handleSendMessage(transcript);
    };
  };

  // 处理消息搜索
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 根据搜索关键词过滤消息
  const filteredMessages = messages.filter(
    (message) => message.text.includes(searchTerm)
  );

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* 左侧导航栏 */}
      <div className="sidebar">
        <button className="new-conversation" onClick={startNewConversation}>
          {t('start_new_conversation')}
        </button>
        <ul>
          <li onClick={clearHistory}>{t('clear_history')}</li>
          <li onClick={toggleDarkMode}>{isDarkMode ? '白天模式' : '夜间模式'}</li>
          <li onClick={toggleSettings}>{t('settings')}</li>
          <li>{t('logout')}</li>
          <li>导出聊天记录</li>
        </ul>
        {/* 历史聊天记录 */}
        {chatHistory.length > 0 && (
          <div className="history-section">
            <h2>历史记录</h2>
            <ul>
              {chatHistory.map((chat) => (
                <li key={chat.id} onClick={() => loadHistory(chat.id)}>
                  对话于 {new Date(chat.id).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 主内容 */}
      <div className="main-content">
        <header>
          <h1>{t('welcome_message')}</h1>
          <div className="top-right">
            <button onClick={toggleLanguageMenu}>语言</button>
            {showLanguageMenu && (
              <div className="language-menu">
                <button onClick={() => handleLanguageChange('zh')}>中文</button>
                <button onClick={() => handleLanguageChange('en')}>English</button>
              </div>
            )}
            <button onClick={handleVoiceInput}>语音输入</button>
          </div>
        </header>

        {/* 设置弹窗 */}
        {showSettings && (
          <div className="settings-modal">
            <div className="modal-content">
              <h2>{t('settings')}</h2>
              <label>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                {'启用夜间模式'}
              </label>
              <button onClick={toggleSettings}>{t('close')}</button>
            </div>
          </div>
        )}

        {/* 预设提示词部分 */}
        <div className="preset-prompts">
          {presetPrompts.map((prompt, index) => (
            <button
              key={index}
              className="preset-prompt-button"
              onClick={() => handlePresetPromptClick(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <div className="search-container">
          <input
            type="text"
            placeholder="搜索消息"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* 聊天记录 */}
        <div className="chat-display">
          {filteredMessages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender}`}>
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
                {message.sender === 'user' && (
                  <button className="recall-button" onClick={() => handleRecallMessage(index)}>
                    撤回
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="loading-indicator"><div className="spinner"></div></div>}
        </div>

        {/* 输入框和发送按钮 */}
        <div className="input-container">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={t('input_placeholder')}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(userInput);
              }
            }}
          />
          <button onClick={() => handleSendMessage(userInput)}>{t('send')}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
