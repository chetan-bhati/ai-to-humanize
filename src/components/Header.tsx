import React from 'react';

const Header = () => {
  return (
    <header style={{
      padding: '1.25rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 9, 11, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #00d1b2 0%, #329dfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.8rem' }}>⚙️</span>
          NLP Humanizer
        </div>
        
        <nav style={{ display: 'flex', gap: '2.5rem' }}>
          <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Documentation</a>
          <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Visualizer</a>
          <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Benchmarks</a>
        </nav>

        <button className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
          API Access
        </button>
      </div>
    </header>
  );
};

export default Header;
