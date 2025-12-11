import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import '../styles/ChatPage.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domain, setDomain] = useState('');
  const [userId, setUserId] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedDomain = localStorage.getItem('selected_domain');
    const storedUserId = localStorage.getItem('user_id');
    
    if (!selectedDomain || !storedUserId) {
      navigate('/domain-selector', { replace: true });
      return;
    }
    
    setDomain(selectedDomain);
    setUserId(storedUserId);
    initializeChat(selectedDomain);
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeChat = (selectedDomain) => {
    const domainNames = {
      health: 'Health & Wellness',
      finance: 'Finance & Money',
      career: 'Career & Growth',
      relationship: 'Relationships & Love'
    };

    const welcomeMessage = {
      id: -1,
      text: `👋 **Welcome to ${domainNames[selectedDomain] || selectedDomain}!**\n\nI'm your AI Life Coach. Share your situation, and I'll provide personalized guidance based on proven strategies and insights. 💡\n\n**How to get the best advice:**\n- 📝 Be specific about your situation\n- 🎯 Share relevant details\n- 💭 Ask follow-up questions\n- 🔄 We'll build on our conversation\n\nWhat would you like to discuss today?`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const userInput = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatService.predict(domain, userInput, userId);

      if (response.data && response.data.result_text) {
        const botMessage = {
          id: messages.length + 1,
          text: response.data.result_text,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 1,
        text: '❌ Sorry, there was an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="chat-wrapper">
      {/* Animated Background */}
      <div className="animated-bg">
        <motion.div 
          className="float-shape shape-1" 
          animate={{ 
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 15, 0]
          }} 
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          className="float-shape shape-2" 
          animate={{ 
            y: [0, -40, 0],
            x: [0, -20, 0],
            scale: [1, 1.4, 1],
            rotate: [0, -20, 0]
          }} 
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            delay: 0.5,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          className="float-shape shape-3" 
          animate={{ 
            y: [0, 35, 0],
            x: [0, 40, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 25, 0]
          }} 
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            delay: 1,
            ease: "easeInOut"
          }} 
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -180],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '10px',
              height: '10px',
              background: 'white',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      <motion.div
        className="chat-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <motion.div
          className="chat-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
        >
          {/* Header with shine effect */}
          <div className="chat-header">
            <motion.div
              animate={{
                x: ['-100%', '200%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <motion.span
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                style={{ fontSize: '2rem', filter: 'drop-shadow(0 5px 15px rgba(255, 255, 255, 0.4))' }}
              >
                ✨
              </motion.span>
              <div>
                <h2>LifeAlly AI</h2>
                <p className="chat-subtitle">
                  {domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : ''} Coaching
                </p>
              </div>
            </motion.div>
            
            <motion.button
              onClick={() => {
                localStorage.removeItem('selected_domain');
                navigate('/domain-selector', { replace: true });
              }}
              className="back-button"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 20px rgba(255, 255, 255, 0.3)',
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              ← Back
            </motion.button>
          </div>

          {/* Messages Container */}
          <div className="messages-container">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.sender}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <motion.div
                    className={`message-bubble ${message.isError ? 'error' : ''}`}
                    whileHover={{
                      scale: 1.02,
                      y: -2
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {message.sender === 'bot' ? (
                      <MarkdownRenderer text={message.text} />
                    ) : (
                      message.text
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                className="message bot"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="message-bubble loading"
                  animate={{
                    boxShadow: [
                      '0 4px 15px rgba(102, 126, 234, 0.1)',
                      '0 8px 25px rgba(102, 126, 234, 0.3)',
                      '0 4px 15px rgba(102, 126, 234, 0.1)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="typing-indicator">
                    <motion.span
                      animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.span
                      animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.span
                      animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <motion.form
            onSubmit={handleSendMessage}
            className="chat-input-form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          >
            <motion.input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your situation..."
              className="chat-input"
              whileFocus={{
                scale: 1.02,
                boxShadow: '0 0 25px rgba(102, 126, 234, 0.4)'
              }}
              whileHover={{ scale: 1.01 }}
              disabled={isLoading}
            />
            
            <motion.button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="send-button"
              whileHover={{
                scale: 1.08,
                y: -3,
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.5)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={isLoading ? { rotate: 360 } : {}}
                transition={{
                  duration: 1.5,
                  repeat: isLoading ? Infinity : 0,
                  ease: "linear"
                }}
              >
                {isLoading ? '⏳' : '✉️'}
              </motion.span>
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}