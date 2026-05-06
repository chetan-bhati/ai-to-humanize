"use client";

import React, { useState, useEffect, useRef } from 'react';
import { humanizeText, analyzeText, getWordCount, getCharCount, AnalysisToken } from '@/lib/humanizer';
import { getTransformer } from '@/lib/transformer';
import NlpVisualizer from './NlpVisualizer';

const Converter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisToken[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'analysis'>('text');
  const [engineMode, setEngineMode] = useState<'fast' | 'ultra'>('fast');
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingModel, setLoadingModel] = useState(false);
  const [statusText, setStatusText] = useState('');

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Stats
  const [variationScore, setVariationScore] = useState(0);

  const calculateStats = (text: string) => {
    if (!text) return;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lengths = sentences.map(s => s.trim().split(/\s+/).length);
    if (lengths.length < 2) {
      setVariationScore(40);
      return;
    }
    // Simple variance-based score
    const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / lengths.length;
    const score = Math.min(100, Math.max(20, variance * 5 + 30));
    setVariationScore(Math.round(score));
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    if (engineMode === 'fast') {
      setTimeout(() => {
        const humanized = humanizeText(inputText);
        setOutputText(humanized);
        setAnalysis(analyzeText(humanized));
        calculateStats(humanized);
        setIsProcessing(false);
      }, 1000);
    } else {
      setLoadingModel(true);
      setStatusText('Initializing Model...');
      try {
        const transformer = getTransformer();
        const humanized = await transformer.humanize(inputText, (p, status) => {
          setLoadProgress(Math.round(p));
          if (status) setStatusText(status);
        });
        setOutputText(humanized);
        setAnalysis(analyzeText(humanized));
        calculateStats(humanized);
      } catch (err) {
        console.error("Transformer error:", err);
        setOutputText("Error loading model. Please try Fast mode.");
      } finally {
        setLoadingModel(false);
        setIsProcessing(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <section style={{ padding: '2rem 0 8rem 0' }}>
      <div className="container">
        {/* Dashboard Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          marginBottom: '1.5rem' 
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Humanization Pipeline</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button 
                onClick={() => setEngineMode('fast')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: engineMode === 'fast' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  borderBottom: engineMode === 'fast' ? '2px solid var(--primary)' : '2px solid transparent'
                }}
              >
                FAST (Rule-based)
              </button>
              <button 
                onClick={() => setEngineMode('ultra')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: engineMode === 'ultra' ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  borderBottom: engineMode === 'ultra' ? '2px solid var(--primary)' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                ULTRA (Transformer) <span style={{ fontSize: '0.7rem', background: 'rgba(0,209,178,0.1)', padding: '1px 4px', borderRadius: '4px' }}>AI</span>
              </button>
            </div>
          </div>
          
          <div className="view-toggle" style={{ 
            display: 'flex', 
            background: 'rgba(255,255,255,0.05)', 
            padding: '4px', 
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button 
              onClick={() => setViewMode('text')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'text' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: viewMode === 'text' ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              Output
            </button>
            <button 
              onClick={() => setViewMode('analysis')}
              disabled={mounted ? !outputText : true}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'analysis' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'analysis' ? '#000' : 'rgba(255,255,255,0.4)',
                cursor: outputText ? 'pointer' : 'not-allowed',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              NLP Mapping
            </button>
          </div>
        </div>

        <div className="glass" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1px',
          background: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          minHeight: '600px',
          border: '1px solid var(--card-border)'
        }}>
          {/* Input Area */}
          <div style={{
            padding: '2.5rem',
            background: 'rgba(9, 9, 11, 0.4)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>ORIGINAL TEXT</span>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
                {getWordCount(inputText)} words
              </span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste AI-generated text here..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
            
            <div style={{ marginTop: '2rem' }}>
              <button 
                onClick={handleHumanize}
                disabled={mounted ? (isProcessing || !inputText.trim()) : true}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
              >
                {isProcessing ? 'Processing...' : `Run ${engineMode === 'ultra' ? 'Transformer' : 'Fast'} Pipeline ⚡`}
              </button>
              
              {loadingModel && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                    <span>{loadProgress < 100 ? 'Downloading Model...' : (statusText || 'Processing...')}</span>
                    <span>{loadProgress}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', width: `${loadProgress}%`, transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Area */}
          <div style={{
            padding: '2.5rem',
            background: 'rgba(9, 9, 11, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--primary)' }}>
                {viewMode === 'analysis' ? 'LINGUISTIC ANALYSIS' : 'HUMANIZED RESULT'}
              </span>
              {outputText && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                   <div style={{ 
                    background: 'rgba(0, 209, 178, 0.05)', 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    border: '1px solid rgba(0, 209, 178, 0.1)'
                  }}>
                    VARIATION: {variationScore}%
                  </div>
                  <button 
                    onClick={handleCopy}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            <div style={{
              flex: 1,
              color: outputText ? '#fff' : 'rgba(255,255,255,0.1)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              whiteSpace: viewMode === 'text' ? 'pre-wrap' : 'normal',
              overflowY: 'auto'
            }}>
              {isProcessing && !loadingModel ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem',
                  marginTop: '1rem'
                }}>
                  <div className="skeleton" style={{ height: '24px', width: '95%' }}></div>
                  <div className="skeleton" style={{ height: '24px', width: '85%' }}></div>
                  <div className="skeleton" style={{ height: '24px', width: '90%' }}></div>
                </div>
              ) : (
                viewMode === 'text' ? (
                  outputText || "The humanized text will appear here. Ultra mode uses a transformer model for much higher quality."
                ) : (
                  <NlpVisualizer tokens={analysis} />
                )
              )}
            </div>
            
            {outputText && viewMode === 'text' && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <span>
                  {engineMode === 'fast' 
                    ? "Fast mode uses rules. Try Ultra mode for better rhythm and less jargon." 
                    : "Ultra mode successfully restructured the text using Transformer-based inference."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(0, 209, 178, 0.05) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 6px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 992px) {
          .glass {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Converter;
