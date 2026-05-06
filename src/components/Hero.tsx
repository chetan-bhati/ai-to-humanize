import React from 'react';

const Hero = () => {
  return (
    <section style={{
      padding: '6rem 0 4rem 0',
      textAlign: 'center',
    }}>
      <div className="container animate-fade-in">
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.2rem',
          borderRadius: '100px',
          background: 'rgba(0, 209, 178, 0.1)',
          border: '1px solid rgba(0, 209, 178, 0.2)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '2rem',
          letterSpacing: '0.05em'
        }}>
          INDUSTRIAL-STRENGTH NLP ENGINE
        </div>
        
        <h1 style={{ maxWidth: '900px', margin: '0 auto 1.5rem auto' }}>
          Humanize AI Text with <br />
          <span style={{ color: '#fff' }}>Linguistic Precision</span>
        </h1>
        
        <p style={{ 
          maxWidth: '700px', 
          margin: '0 auto 2.5rem auto', 
          fontSize: '1.25rem',
          color: 'var(--text-muted)'
        }}>
          Bypass detectors and improve readability using our spaCy-inspired NLP pipeline. 
          Analyze syntax, parts of speech, and sentence structure in real-time.
        </p>
      </div>
    </section>
  );
};

export default Hero;
