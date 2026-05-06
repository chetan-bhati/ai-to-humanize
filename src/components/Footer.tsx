import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '4rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(5, 5, 8, 0.5)',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '4rem',
          marginBottom: '4rem'
        }}>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1.5rem'
            }}>
              HumanizeAI
            </div>
            <p style={{ maxWidth: '300px', fontSize: '0.9rem' }}>
              Making AI content indistinguishable from human writing. Join thousands of creators who trust us.
            </p>
          </div>
          
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1rem' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>Converter</li>
              <li>AI Detector</li>
              <li>API Access</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>About</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.85rem'
        }}>
          <div>© 2024 HumanizeAI Inc. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Twitter</span>
            <span>LinkedIn</span>
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
