// LoginPage.jsx - Enhanced with more animations
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import '../styles/LoginPage.css';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAbout, setShowAbout] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      
      if (response.data && response.data.user_id) {
        const userId = response.data.user_id.toString();
        const role = response.data.role || 'user';
        
        localStorage.setItem('user_id', userId);
        localStorage.setItem('role', role);
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        navigate('/domain-selector', { replace: true });
      } else {
        setError('Invalid server response');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.6, -0.05, 0.01, 0.99],
        staggerChildren: 0.1
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { 
        delay: i * 0.15, 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      },
    }),
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -90 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { 
        delay: i * 0.12, 
        duration: 0.6,
        type: "spring",
        stiffness: 200
      },
    }),
  };

  const techInfo = {
    'Machine Learning': {
      icon: '🤖',
      title: 'Machine Learning',
      description: 'Advanced algorithms that learn from your patterns and behaviors to provide increasingly personalized advice. Our ML models analyze thousands of data points to understand your unique situation and deliver tailored recommendations that evolve with you.'
    },
    'NLP': {
      icon: '💬',
      title: 'Natural Language Processing',
      description: 'Sophisticated language understanding that enables natural conversations. Our NLP technology comprehends context, sentiment, and nuance in your messages, making interactions feel human and intuitive while extracting meaningful insights from your communications.'
    },
    'Gemini AI': {
      icon: '✨',
      title: 'Gemini AI',
      description: 'Powered by Google\'s latest multimodal AI technology, providing cutting-edge intelligence and reasoning capabilities. Gemini enables LifeAlly to understand complex scenarios, provide deep insights, and generate creative solutions to your life challenges.'
    },
    'React': {
      icon: '⚛️',
      title: 'React',
      description: 'Modern, lightning-fast user interface built with React. Experience smooth animations, instant responses, and a seamless experience across all devices. Our component-based architecture ensures reliability and consistent performance.'
    },
    'Flask': {
      icon: '🐍',
      title: 'Flask',
      description: 'Robust Python backend framework powering our API services. Flask provides secure, scalable server infrastructure that handles your data with enterprise-grade security while maintaining fast response times for all your interactions.'
    },
    'PostgreSQL': {
      icon: '🗄️',
      title: 'PostgreSQL',
      description: 'Enterprise-grade database system ensuring your data is secure, reliable, and always available. PostgreSQL\'s advanced features enable complex queries, data integrity, and high-performance storage for your personal information and conversation history.'
    }
  };

  return (
    <div className="login-wrapper">
      {/* Enhanced Animated Background */}
      <div className="animated-bg">
        <motion.div 
          className="float-shape shape-1" 
          animate={{ 
            y: [0, 40, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0]
          }} 
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          className="float-shape shape-2" 
          animate={{ 
            y: [0, -35, 0],
            x: [0, -15, 0],
            scale: [1, 1.3, 1],
            rotate: [0, -15, 0]
          }} 
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            delay: 0.5,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          className="float-shape shape-3" 
          animate={{ 
            y: [0, 25, 0],
            x: [0, 30, 0],
            scale: [1, 1.15, 1],
            rotate: [0, 20, 0]
          }} 
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            delay: 1,
            ease: "easeInOut"
          }} 
        />
        
        {/* Additional floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            animate={{
              y: [-20, -150],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '8px',
              height: '8px',
              background: 'white',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!showAbout ? (
          <motion.div
            key="login"
            className="login-content"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <motion.div
              className="login-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Enhanced Logo Section */}
              <motion.div
                className="logo-section"
                initial={{ scale: 0.3, opacity: 0, rotateY: -180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ 
                  duration: 1.2,
                  type: "spring",
                  stiffness: 150,
                  damping: 15
                }}
              >
                <div className="logo-animated">
                  <motion.div
                    className="logo-icon"
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      rotate: {
                        duration: 25, 
                        repeat: Infinity, 
                        ease: 'linear'
                      },
                      scale: {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    whileHover={{ scale: 1.5, rotate: 45 }}
                  >
                    ✨
                  </motion.div>
                </div>
                <motion.h1 
                  className="login-title"
                  variants={itemVariants}
                >
                  LifeAlly
                </motion.h1>
                <motion.p 
                  className="login-tagline"
                  variants={itemVariants}
                >
                  Your AI Life Coach for Success
                </motion.p>
              </motion.div>

              <motion.p
                className="login-subtitle"
                variants={itemVariants}
              >
                Welcome Back! Log in to your account
              </motion.p>

              <form onSubmit={handleLogin} className="login-form">
                <motion.div
                  custom={0}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                    whileFocus={{ 
                      scale: 1.02,
                      y: -3,
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)'
                    }}
                    whileHover={{ scale: 1.01 }}
                    required
                  />
                </motion.div>

                <motion.div
                  custom={1}
                  variants={inputVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    whileFocus={{ 
                      scale: 1.02,
                      y: -3,
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)'
                    }}
                    whileHover={{ scale: 1.01 }}
                    required
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="error-message"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="login-button"
                  whileHover={{ 
                    scale: 1.05,
                    y: -3,
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <motion.span
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                  >
                    {isLoading ? '⏳' : 'Log In'}
                  </motion.span>
                </motion.button>
              </form>

              <motion.p
                className="login-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Don't have an account? <a href="/register">Sign up</a>
              </motion.p>

              <motion.button
                onClick={() => setShowAbout(true)}
                className="about-btn"
                whileHover={{ 
                  scale: 1.05,
                  y: -3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.25) 0%, rgba(118, 75, 162, 0.25) 100%)'
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  Learn About LifeAlly ✨
                </motion.span>
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="about"
            className="about-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              className="about-modal"
              initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 100, rotateX: 15 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 25,
                mass: 0.5
              }}
            >
              <div className="about-header-section">
                <motion.button
                  onClick={() => setShowAbout(false)}
                  className="close-btn"
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  ✕
                </motion.button>

                <motion.h2
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="about-main-title"
                >
                  About LifeAlly AI
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="about-subtitle"
                >
                  Empowering Your Life, One Conversation at a Time
                </motion.p>
              </div>

              <div className="about-scroll-area">
                {/* What is LifeAlly */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  className="about-section"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
                    x: 5
                  }}
                >
                  <h3>🎯 What is LifeAlly?</h3>
                  <p>
                    LifeAlly is your personal AI life coach, powered by advanced machine learning and expert guidance. 
                    We help you navigate life's challenges across four key domains: Career, Finance, Health, and Relationships. 
                  </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="features-section"
                >
                  <h3 style={{ marginBottom: '1.5rem' }}>💫 Our Core Domains</h3>
                  <div className="features-grid">
                    <motion.div
                      custom={0}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                      className="feature-card career"
                      whileHover={{ 
                        scale: 1.08, 
                        y: -8,
                        boxShadow: '0 20px 40px rgba(70, 130, 180, 0.3)',
                        rotate: 2
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="feature-icon"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      >
                        💼
                      </motion.div>
                      <h4>Career Growth</h4>
                      <p>Navigate your professional journey with confidence and strategic guidance.</p>
                    </motion.div>

                    <motion.div
                      custom={1}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                      className="feature-card finance"
                      whileHover={{ 
                        scale: 1.08, 
                        y: -8,
                        boxShadow: '0 20px 40px rgba(184, 134, 11, 0.3)',
                        rotate: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="feature-icon"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        💰
                      </motion.div>
                      <h4>Financial Wisdom</h4>
                      <p>Master budgeting, investing, and build long-term wealth security.</p>
                    </motion.div>

                    <motion.div
                      custom={2}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                      className="feature-card health"
                      whileHover={{ 
                        scale: 1.08, 
                        y: -8,
                        boxShadow: '0 20px 40px rgba(220, 20, 60, 0.3)',
                        rotate: 2
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="feature-icon"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        🥗
                      </motion.div>
                      <h4>Health & Wellness</h4>
                      <p>Improve physical and mental health with personalized wellness strategies.</p>
                    </motion.div>

                    <motion.div
                      custom={3}
                      variants={featureVariants}
                      initial="hidden"
                      animate="visible"
                      className="feature-card relationship"
                      whileHover={{ 
                        scale: 1.08, 
                        y: -8,
                        boxShadow: '0 20px 40px rgba(219, 39, 119, 0.3)',
                        rotate: -2
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div 
                        className="feature-icon"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1 }}
                      >
                        💕
                      </motion.div>
                      <h4>Relationships</h4>
                      <p>Build deeper meaningful connections and navigate relationships with ease.</p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* How It Works */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="about-section"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
                    x: 5
                  }}
                >
                  <h3>🚀 How It Works</h3>
                  <ul className="steps-list">
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <strong>📝 Share Your Situation</strong> - Tell us what's on your mind
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <strong>🤖 AI Analysis</strong> - Our models analyze and understand your needs
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <strong>💡 Personalized Advice</strong> - Get tailored recommendations
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <strong>🔄 Track Progress</strong> - Monitor growth and improvements over time
                    </motion.li>
                  </ul>
                </motion.div>

                {/* Technology */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, type: "spring" }}
                  className="about-section"
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
                    x: 5
                  }}
                >
                  <h3>🔬 Powered By Cutting-Edge Technology</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Click on any technology to learn more</p>
                  <div className="tech-stack">
                    {['Machine Learning', 'NLP', 'Gemini AI', 'React', 'Flask', 'PostgreSQL'].map((tech, i) => (
                      <motion.button
                        key={tech}
                        className="tech-badge"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.15, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTech(selectedTech === tech ? null : tech);
                        }}
                        style={{ 
                          cursor: 'pointer',
                          border: selectedTech === tech ? '2px solid white' : 'none'
                        }}
                      >
                        {tech}
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {selectedTech && techInfo[selectedTech] && (
                      <motion.div
                        key={selectedTech}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        style={{
                          background: 'white',
                          padding: '1.5rem',
                          borderRadius: '12px',
                          border: '2px solid #667eea',
                          marginTop: '1.5rem',
                          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '2rem' }}>{techInfo[selectedTech].icon}</span>
                          <h4 style={{ margin: 0, color: '#667eea', fontSize: '1.2rem', fontWeight: 700 }}>
                            {techInfo[selectedTech].title}
                          </h4>
                        </div>
                        <p style={{ margin: 0, color: '#666', lineHeight: '1.8', fontSize: '0.95rem' }}>
                          {techInfo[selectedTech].description}
                        </p>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTech(null);
                          }}
                          style={{
                            marginTop: '1rem',
                            padding: '0.6rem 1.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✓ Got it!
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Closing CTA */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
                  className="about-section closing"
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 50px rgba(102, 126, 234, 0.4)' }}
                >
                  <h3>✨ Ready to Transform Your Life?</h3>
                  <p>
                    Empower yourself with AI-driven insights and achieve your dreams, one conversation at a time
                  </p>
                  <motion.button
                    onClick={() => setShowAbout(false)}
                    className="cta-button"
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Get Started Now →
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}