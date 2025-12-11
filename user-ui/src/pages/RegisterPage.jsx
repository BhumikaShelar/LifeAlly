// RegisterPage.jsx - Enhanced with animations matching LoginPage
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import '../styles/RegisterPage.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(name, email, password);
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed. Try again.';
      setError(errorMsg);
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
        delay: i * 0.12, 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      },
    }),
  };

  return (
    <div className="register-wrapper">
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
        
        {/* Floating particles */}
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

      <motion.div
        className="register-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        <motion.div
          className="register-container"
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
              className="register-title"
              variants={itemVariants}
            >
              LifeAlly
            </motion.h1>
          </motion.div>

          <motion.p
            className="register-subtitle"
            variants={itemVariants}
          >
            Create your account to get started!
          </motion.p>

          <form onSubmit={handleRegister} className="register-form">
            <motion.div
              custom={0}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="register-input"
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
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register-input"
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
              custom={2}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.input
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="register-input"
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
              custom={3}
              variants={inputVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="register-input"
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

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="success-message"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="register-button"
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
                {isLoading ? '⏳ Creating Account...' : 'Sign Up'}
              </motion.span>
            </motion.button>
          </form>

          <motion.p
            className="register-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Already have an account? <Link to="/login">Log in</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}