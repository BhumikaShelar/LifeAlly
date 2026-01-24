import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      id: 'career',
      icon: '💼',
      title: 'Career Growth',
      description: 'Navigate your professional journey',
      color: '#45B7D1',
      gradient: 'linear-gradient(135deg, #45B7D1 0%, #4A90E2 100%)',
    },
    {
      id: 'finance',
      icon: '💰',
      title: 'Financial Wisdom',
      description: 'Master your money management',
      color: '#4ECDC4',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    },
    {
      id: 'health',
      icon: '🥗',
      title: 'Health & Wellness',
      description: 'Transform your physical wellbeing',
      color: '#FF6B6B',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    },
    {
      id: 'relationship',
      icon: '💕',
      title: 'Relationships',
      description: 'Build meaningful connections',
      color: '#FF69B4',
      gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
    }
  ];

  const stats = [
    { number: '100%', label: 'Free to Use' },
    { number: '∞', label: 'Unlimited Chats' },
    { number: '4', label: 'Life Domains' },
    { number: '24/7', label: 'AI Support' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated Background */}
      <div style={styles.animatedBg}>
        <motion.div 
          style={{...styles.floatShape, ...styles.shape1}}
          animate={{ 
            y: [0, 60, 0],
            x: [0, 40, 0],
            scale: [1, 1.4, 1],
            rotate: [0, 20, 0]
          }} 
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          style={{...styles.floatShape, ...styles.shape2}}
          animate={{ 
            y: [0, -50, 0],
            x: [0, -30, 0],
            scale: [1, 1.5, 1],
            rotate: [0, -25, 0]
          }} 
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            delay: 0.5,
            ease: "easeInOut"
          }} 
        />
        <motion.div 
          style={{...styles.floatShape, ...styles.shape3}}
          animate={{ 
            y: [0, 40, 0],
            x: [0, 50, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 30, 0]
          }} 
          transition={{ 
            duration: 14, 
            repeat: Infinity, 
            delay: 1,
            ease: "easeInOut"
          }} 
        />

        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-30, -200],
              opacity: [0, 1, 0],
              scale: [0, 2.5, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 5,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut"
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '12px',
              height: '12px',
              background: 'white',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{
          ...styles.nav,
          background: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.2)',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        <motion.div 
          style={styles.navLogo}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={styles.navIcon}
          >
            ✨
          </motion.span>
          <span style={styles.navBrand}>LifeAlly AI</span>
        </motion.div>
        <div style={styles.navActions}>
          <motion.button
            onClick={() => setShowContact(true)}
            style={{...styles.navBtn, ...styles.contactBtn}}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact
          </motion.button>
          <motion.button
            onClick={() => navigate('/login')}
            style={{...styles.navBtn, ...styles.loginBtn}}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>
          <motion.button
            onClick={() => navigate('/register')}
            style={{...styles.navBtn, ...styles.signupBtn}}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        style={styles.heroSection}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          style={styles.heroContent}
          variants={itemVariants}
        >
          <motion.div
            style={styles.heroIcon}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
          
          <motion.h1 
            style={styles.heroTitle}
            variants={itemVariants}
          >
            Your AI Life Coach
          </motion.h1>
          
          <motion.p 
            style={styles.heroSubtitle}
            variants={itemVariants}
          >
            Transform your life with personalized guidance across Career, Finance, Health, and Relationships
          </motion.p>

          <motion.div 
            style={styles.heroCta}
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigate('/register')}
              style={styles.ctaPrimary}
              whileHover={{ 
                scale: 1.08,
                y: -5,
                boxShadow: '0 20px 50px rgba(102, 126, 234, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started Free</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
            
            <motion.button
              onClick={() => {
                document.getElementById('features-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              style={styles.ctaSecondary}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          style={styles.statsContainer}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              style={styles.statCard}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.08,
                y: -5,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
              }}
            >
              <motion.div 
                style={styles.statNumber}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
              >
                {stat.number}
              </motion.div>
              <div style={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section id="features-section" style={styles.featuresSection}>
        <motion.div
          style={styles.sectionHeader}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={styles.sectionTitle}>Choose Your Path to Success</h2>
          <p style={styles.sectionSubtitle}>Expert AI guidance tailored to your life goals</p>
        </motion.div>

        <motion.div 
          style={styles.featuresGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              style={{
                ...styles.featureCard,
                borderLeft: `6px solid ${feature.color}`,
                background: activeFeature === feature.id 
                  ? `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)` 
                  : 'white'
              }}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.08,
                y: -15,
                boxShadow: `0 30px 70px ${feature.color}40`,
                rotateY: 5,
              }}
              onHoverStart={() => setActiveFeature(feature.id)}
              onHoverEnd={() => setActiveFeature(null)}
            >
              <motion.div
                style={styles.featureIconLarge}
                animate={activeFeature === feature.id ? {
                  scale: [1, 1.4, 1.2],
                  rotate: [0, 15, -15, 0],
                  y: [0, -10, 0]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>

              <h3 
                style={{
                  ...styles.featureTitle,
                  background: feature.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {feature.title}
              </h3>
              
              <p style={styles.featureDescription}>{feature.description}</p>

              <motion.div
                style={{
                  ...styles.featureArrow,
                  background: feature.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                animate={activeFeature === feature.id ? { x: [0, 15, 0] } : {}}
                transition={{ duration: 1, repeat: activeFeature === feature.id ? Infinity : 0 }}
              >
                →
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howSection}>
        <motion.div
          style={styles.sectionHeader}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={styles.sectionTitle}>How LifeAlly Works</h2>
          <p style={styles.sectionSubtitle}>Your journey to success in 4 simple steps</p>
        </motion.div>

        <motion.div 
          style={styles.stepsContainer}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { number: '1', icon: '📝', title: 'Sign Up', desc: 'Create your free account in seconds' },
            { number: '2', icon: '🎯', title: 'Choose Domain', desc: 'Select your focus area' },
            { number: '3', icon: '💬', title: 'Share Your Goals', desc: 'Tell us what you want to achieve' },
            { number: '4', icon: '🚀', title: 'Get Guidance', desc: 'Receive personalized AI coaching' }
          ].map((step, index) => (
            <motion.div
              key={index}
              style={styles.stepCard}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)'
              }}
            >
              <motion.div 
                style={styles.stepNumber}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.5
                }}
              >
                {step.number}
              </motion.div>
              <div style={styles.stepIcon}>{step.icon}</div>
              <h4 style={styles.stepTitle}>{step.title}</h4>
              <p style={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section 
        style={styles.ctaSection}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          style={styles.ctaContainer}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            style={styles.ctaIcon}
            animate={{ 
              rotate: 360,
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            ✨
          </motion.div>
          
          <h2 style={styles.ctaTitle}>Your Journey to Excellence Starts Here</h2>
          <p style={styles.ctaText}>
            Empower yourself with AI-driven insights and achieve your dreams, one conversation at a time
          </p>
          
          <motion.button
            onClick={() => navigate('/register')}
            style={styles.ctaButton}
            whileHover={{ 
              scale: 1.1,
              y: -5,
              boxShadow: '0 20px 50px rgba(255, 255, 255, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Journey Today</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer style={styles.footer}>
        <motion.div
          style={styles.footerContent}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div style={styles.footerBrand}>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={styles.footerIcon}
            >
              ✨
            </motion.span>
            <span style={styles.footerName}>LifeAlly AI</span>
          </div>
          <p style={styles.footerText}>
            © 2025 LifeAlly AI. Empowering lives with artificial intelligence.
          </p>
          <p style={styles.footerDeveloper}>
            Developed by Bhumika Shelar
          </p>
        </motion.div>
      </footer>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            style={styles.contactOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
          >
            <motion.div
              style={styles.contactModal}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <motion.button
                style={styles.contactClose}
                onClick={() => setShowContact(false)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              <motion.div
                style={styles.contactHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div style={styles.contactIcon}>💬</div>
                <h3 style={styles.contactHeaderTitle}>Get in Touch</h3>
                <p style={styles.contactHeaderText}>Let's connect and discuss how LifeAlly can help you</p>
              </motion.div>

              <motion.div
                style={styles.contactInfo}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  style={styles.contactItem}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div style={styles.contactItemIcon}>👤</div>
                  <div style={styles.contactItemContent}>
                    <div style={styles.contactLabel}>Developer</div>
                    <div style={styles.contactValue}>Bhumika Shelar</div>
                  </div>
                </motion.div>

                <motion.div 
                  style={styles.contactItem}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div style={styles.contactItemIcon}>📧</div>
                  <div style={styles.contactItemContent}>
                    <div style={styles.contactLabel}>Email</div>
                    <a 
                      href="mailto:shelarbhumikacs232434@gmail.com" 
                      style={{...styles.contactValue, ...styles.contactLink}}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      shelarbhumikacs232434@gmail.com
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  style={styles.contactItem}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div style={styles.contactItemIcon}>💼</div>
                  <div style={styles.contactItemContent}>
                    <div style={styles.contactLabel}>LinkedIn</div>
                    <a 
                      href="https://www.linkedin.com/in/bhumika-shelar-7139a5315" 
                      style={{...styles.contactValue, ...styles.contactLink}}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Connect on LinkedIn →
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                style={styles.contactFooterNote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p style={styles.contactFooterNoteText}>💡 This is a college project showcasing AI-powered life coaching</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflowX: 'hidden',
  },
  animatedBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  floatShape: {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.1,
    background: 'white',
  },
  shape1: {
    width: '300px',
    height: '300px',
    top: '10%',
    left: '10%',
  },
  shape2: {
    width: '250px',
    height: '250px',
    top: '50%',
    right: '15%',
  },
  shape3: {
    width: '280px',
    height: '280px',
    bottom: '10%',
    left: '50%',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 4rem',
    transition: 'all 0.3s ease',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  navIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 4px 10px rgba(255, 255, 255, 0.4))',
  },
  navBrand: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'white',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  navActions: {
    display: 'flex',
    gap: '1rem',
  },
  navBtn: {
    padding: '0.75rem 1.75rem',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
  },
  contactBtn: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.5)',
  },
  loginBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid white',
  },
  signupBtn: {
    background: 'white',
    color: '#667eea',
    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
  },
  heroSection: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '6rem 2rem 4rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '900px',
    marginBottom: '4rem',
  },
  heroIcon: {
    fontSize: '5rem',
    marginBottom: '2rem',
    filter: 'drop-shadow(0 10px 30px rgba(255, 255, 255, 0.5))',
  },
  heroTitle: {
    fontSize: '4.5rem',
    fontWeight: 900,
    color: 'white',
    margin: '0 0 1.5rem 0',
    lineHeight: 1.1,
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3)',
    letterSpacing: '-2px',
  },
  heroSubtitle: {
    fontSize: '1.4rem',
    color: 'white',
    margin: '0 0 3rem 0',
    lineHeight: 1.6,
    fontWeight: 600,
    textShadow: '0 3px 15px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  heroCta: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    padding: '1.2rem 2.5rem',
    borderRadius: '15px',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '200px',
    justifyContent: 'center',
    background: 'white',
    color: '#667eea',
    boxShadow: '0 10px 40px rgba(255, 255, 255, 0.4)',
  },
  ctaSecondary: {
    padding: '1.2rem 2.5rem',
    borderRadius: '15px',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid white',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minWidth: '200px',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '2rem',
    maxWidth: '1100px',
    width: '100%',
    padding: '0 2rem',
  },
  statCard: {
    background: 'white',
    padding: '2rem 1.5rem',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  statNumber: {
    fontSize: '2.5rem',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: 600,
  },
  featuresSection: {
    position: 'relative',
    zIndex: 1,
    padding: '6rem 2rem',
    background: 'white',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#1a1a1a',
    margin: '0 0 1rem 0',
    letterSpacing: '-1px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  sectionSubtitle: {
    fontSize: '1.2rem',
    color: '#333',
    margin: 0,
    fontWeight: 600,
    textShadow: 'none',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2.5rem',
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  featureCard: {
    borderRadius: '25px',
    padding: '3rem 2.5rem',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
    position: 'relative',
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    perspective: '1000px',
  },
  featureIconLarge: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15))',
  },
  featureTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    margin: '0 0 1rem 0',
    lineHeight: 1.3,
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#666',
    margin: '0 0 1rem 0',
    lineHeight: 1.6,
    fontWeight: 500,
  },
  featureArrow: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginTop: '1.5rem',
    display: 'inline-block',
  },
  howSection: {
    position: 'relative',
    zIndex: 1,
    padding: '6rem 2rem',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2.5rem',
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  stepCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '50px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 900,
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  },
  stepIcon: {
    fontSize: '3.5rem',
    margin: '2rem 0 1.5rem',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1))',
  },
  stepTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#333',
    margin: '0 0 0.75rem 0',
  },
  stepDesc: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0,
    lineHeight: 1.6,
  },
  ctaSection: {
    position: 'relative',
    zIndex: 1,
    padding: '6rem 2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  ctaContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(20px)',
    borderRadius: '30px',
    padding: '4rem 3rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  ctaIcon: {
    fontSize: '4rem',
    marginBottom: '2rem',
    filter: 'drop-shadow(0 10px 30px rgba(255, 255, 255, 0.5))',
  },
  ctaTitle: {
    fontSize: '3rem',
    fontWeight: 900,
    color: 'white',
    margin: '0 0 1.5rem 0',
    lineHeight: 1.2,
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  ctaText: {
    fontSize: '1.2rem',
    color: 'white',
    margin: '0 0 2.5rem 0',
    lineHeight: 1.6,
    fontWeight: 600,
    textShadow: '0 3px 15px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  ctaButton: {
    padding: '1.3rem 3rem',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '15px',
    fontWeight: 800,
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 10px 40px rgba(255, 255, 255, 0.4)',
  },
  footer: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    padding: '2.5rem 2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  footerIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 4px 10px rgba(255, 255, 255, 0.4))',
  },
  footerName: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'white',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  },
  footerText: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.9)',
    margin: '0 0 0.5rem 0',
    fontWeight: 500,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  footerDeveloper: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: 0,
    fontWeight: 600,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  contactOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '2rem',
  },
  contactModal: {
    background: 'white',
    borderRadius: '25px',
    maxWidth: '550px',
    width: '100%',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  },
  contactClose: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(102, 126, 234, 0.1)',
    border: '2px solid #667eea',
    color: '#667eea',
    fontSize: '1.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: 10,
  },
  contactHeader: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '3rem 2.5rem 2.5rem',
    textAlign: 'center',
    color: 'white',
  },
  contactIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))',
  },
  contactHeaderTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    margin: '0 0 0.75rem 0',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  contactHeaderText: {
    fontSize: '1rem',
    margin: 0,
    opacity: 0.95,
    fontWeight: 500,
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  contactInfo: {
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.25rem',
    padding: '1.25rem',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    borderRadius: '15px',
    borderLeft: '4px solid #667eea',
    transition: 'all 0.3s ease',
  },
  contactItemIcon: {
    fontSize: '2rem',
    flexShrink: 0,
    filter: 'drop-shadow(0 3px 8px rgba(102, 126, 234, 0.2))',
  },
  contactItemContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  contactLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  contactValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#333',
    wordBreak: 'break-word',
  },
  contactLink: {
    color: '#667eea',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  contactFooterNote: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
    padding: '1.5rem 2.5rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(102, 126, 234, 0.1)',
  },
  contactFooterNoteText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#667eea',
    fontWeight: 600,
  },
}