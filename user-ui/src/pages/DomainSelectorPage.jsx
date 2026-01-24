// DomainSelectorPage.jsx - Enhanced with heavy animations
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/DomainSelector.css';

const DOMAINS = [
  {
    id: 'health',
    name: '🥗 Health',
    description: 'Health and medical advice',
    color: '#FF6B6B',
    icon: '🥗',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    details: 'Get personalized health guidance, wellness tips, and medical advice tailored to your needs.'
  },
  {
    id: 'finance',
    name: '💰 Finance',
    description: 'Financial planning and advice',
    color: '#4ECDC4',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    details: 'Master your finances with budgeting strategies, investment advice, and wealth management tips.'
  },
  {
    id: 'career',
    name: '💼 Career',
    description: 'Career guidance and development',
    color: '#45B7D1',
    icon: '💼',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #4A90E2 100%)',
    details: 'Accelerate your professional growth with career coaching, skill development, and strategic guidance.'
  },
  {
    id: 'relationship',
    name: '💕 Relationship',
    description: 'Relationship advice and guidance',
    color: '#FF69B4',
    icon: '💕',
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
    details: 'Build stronger connections with relationship coaching, communication strategies, and emotional support.'
  },
];

export default function DomainSelectorPage({ onLogout }) {
  const navigate = useNavigate();
  const [hoveredDomain, setHoveredDomain] = useState(null);

  const handleSelectDomain = (domainId) => {
    console.log('DomainSelectorPage - Domain selected:', domainId);
    localStorage.setItem('selected_domain', domainId);
    navigate('/chat');
  };

  const handleLogout = () => {
    console.log('DomainSelectorPage - Logout button clicked');
    
    // Call parent callback to update App state
    if (onLogout) {
      console.log('DomainSelectorPage - Calling onLogout callback');
      onLogout();
    }
    
    // Navigate to login
    console.log('DomainSelectorPage - Navigating to login');
    navigate('/login', { replace: true });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.6,
        type: "spring",
        stiffness: 100
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.3, 
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="domain-wrapper">
      {/* Enhanced Animated Background */}
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
            className="particle"
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
        className="domain-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <motion.div
          className="domain-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
        >
          {/* Header Section */}
          <motion.div 
            className="domain-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="header-content">
              <div className="title-section">
                <motion.div
                  className="sparkle-icon"
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
                >
                  ✨
                </motion.div>
                <div>
                  <h1>Choose Your Domain</h1>
                  <p className="subtitle">Select a domain to start your journey with AI</p>
                </div>
              </div>
              <motion.button 
                onClick={handleLogout}
                type="button"
                className="logout-btn"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(255, 107, 107, 0.4)',
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="logout-icon">🚪</span>
                Logout
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="domains-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {DOMAINS.map((domain, index) => (
              <motion.div
                key={domain.id}
                className="domain-card"
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectDomain(domain.id)}
                onHoverStart={() => setHoveredDomain(domain.id)}
                onHoverEnd={() => setHoveredDomain(null)}
                style={{ 
                  borderLeftColor: domain.color,
                  cursor: 'pointer',
                  background: hoveredDomain === domain.id 
                    ? `linear-gradient(135deg, ${domain.color}15 0%, ${domain.color}08 100%)` 
                    : '#f8f9fa'
                }}
              >
                <div className="card-content-wrapper">
                  <motion.div 
                    className="domain-icon"
                    variants={iconVariants}
                    initial="initial"
                    animate={hoveredDomain === domain.id ? "hover" : "initial"}
                    style={{
                      fontSize: '3rem',
                      marginBottom: '1rem'
                    }}
                  >
                    {domain.icon}
                  </motion.div>
                  
                  <div className="domain-content">
                    <h2 style={{ 
                      background: domain.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {domain.name}
                    </h2>
                    <p className="domain-description">{domain.description}</p>
                    
                    <AnimatePresence>
                      {hoveredDomain === domain.id && (
                        <motion.p
                          className="domain-details"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {domain.details}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="domain-arrow"
                    animate={hoveredDomain === domain.id ? { x: [0, 10, 0] } : { x: 0 }}
                    transition={{ 
                      repeat: hoveredDomain === domain.id ? Infinity : 0,
                      duration: 1
                    }}
                    style={{ 
                      background: domain.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    →
                  </motion.div>
                </div>

                {/* Shine effect on hover */}
                <motion.div
                  className="card-shine"
                  initial={{ x: '-100%' }}
                  animate={hoveredDomain === domain.id ? { x: '200%' } : { x: '-100%' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    pointerEvents: 'none'
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Info */}
          <motion.div
            className="domain-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <p>💡 Tip: Hover over each domain to learn more about what we offer!</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}