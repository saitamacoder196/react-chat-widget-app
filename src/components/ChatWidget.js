import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

function ChatWidget({ logoUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Xin chào! 👋 Tôi có thể giúp gì cho bạn?', isBot: true },
    { id: 2, text: 'Hãy thử upload logo và trải nghiệm chat widget nhé!', isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const widgetRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        isBot: false
      };
      
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate bot response
      setTimeout(() => {
        const botReply = {
          id: messages.length + 2,
          text: `Cảm ơn bạn đã nhắn tin: "${inputValue}". Đây là demo chat widget!`,
          isBot: true
        };
        setMessages(prev => [...prev, botReply]);
      }, 1000);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="chat-widget" ref={widgetRef}>
      <div 
        className={`chat-bubble ${logoUrl ? 'has-image' : ''}`}
        onClick={handleToggleChat}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="Chat Logo" />
        ) : (
          <div className="default-icon">💬</div>
        )}
      </div>
      
      <div className={`chat-popup ${isOpen ? 'show' : ''}`}>
        <div className="chat-header">
          <h3>💬 Chat hỗ trợ</h3>
          <button className="close-btn" onClick={handleCloseChat}>×</button>
        </div>
        
        <div className="chat-messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.isBot ? 'bot' : 'user'}`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Nhập tin nhắn..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

export default ChatWidget;