import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Converter from '@/components/Converter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Converter />
      
      {/* Features Section (Brief) */}
      <section style={{ padding: '6rem 0', background: 'rgba(9, 9, 11, 0.5)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Next-Gen NLP Pipeline</h2>
            <p style={{ fontSize: '1.1rem' }}>We use industrial-strength linguistic analysis to ensure the highest quality output.</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            {[
              { title: "POS Tagging", desc: "Our engine identifies parts of speech to maintain grammatical integrity while rewriting.", icon: '🏷️' },
              { title: "Syntax Analysis", desc: "We analyze sentence structure to break up typical AI patterns and robotic rhythms.", icon: '🧠' },
              { title: "Contextual Synonyms", desc: "Unlike simple word-swappers, we use NLP to choose synonyms that fit the specific context.", icon: '🎯' }
            ].map((feature, idx) => (
              <div key={idx} className="glass" style={{ padding: '3rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '16px', 
                  background: 'rgba(0, 209, 178, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '2rem',
                  fontSize: '1.8rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ marginBottom: '1.25rem', color: '#fff', fontSize: '1.4rem' }}>{feature.title}</h3>
                <p style={{ lineHeight: '1.7' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
