"use client";

import React from 'react';
import { AnalysisToken } from '@/lib/humanizer';

interface NlpVisualizerProps {
  tokens: AnalysisToken[];
}

const tagColors: Record<string, string> = {
  Noun: 'var(--spacy-teal)',
  Verb: 'var(--spacy-purple)',
  Adjective: 'var(--spacy-blue)',
  Adverb: 'var(--spacy-orange)',
  Pronoun: '#ffcc00',
  Preposition: '#999',
  Conjunction: '#666',
};

const getTagColor = (tags: string[]) => {
  for (const tag of tags) {
    if (tagColors[tag]) return tagColors[tag];
  }
  return 'transparent';
};

const getPrimaryTag = (tags: string[]) => {
  const priorities = ['Noun', 'Verb', 'Adjective', 'Adverb', 'Pronoun'];
  for (const p of priorities) {
    if (tags.includes(p)) return p;
  }
  return tags[0] || '';
};

const NlpVisualizer: React.FC<NlpVisualizerProps> = ({ tokens }) => {
  return (
    <div className="nlp-visualizer" style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '0.75rem 0.4rem',
      padding: '1rem',
      background: 'rgba(0,0,0,0.2)',
      borderRadius: '12px',
      lineHeight: '2.5'
    }}>
      {tokens.map((token, idx) => {
        const color = getTagColor(token.tags);
        const primaryTag = getPrimaryTag(token.tags);
        
        return (
          <div key={idx} className="token-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ 
              fontSize: '1.1rem',
              color: token.isChanged ? 'var(--accent)' : '#fff',
              borderBottom: token.isChanged ? `2px dashed var(--accent)` : 'none',
              padding: '2px 4px',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}>
              {token.text}
            </span>
            
            {primaryTag && (
              <span style={{
                position: 'absolute',
                bottom: '-1.2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: color,
                whiteSpace: 'nowrap',
                opacity: 0.8
              }}>
                {primaryTag}
              </span>
            )}

            {token.isChanged && token.suggested && (
              <div className="suggestion-tooltip">
                Suggested: {token.suggested}
              </div>
            )}

            <style jsx>{`
              .token-wrapper:hover span {
                background: rgba(255, 255, 255, 0.1);
              }
              
              .suggestion-tooltip {
                position: absolute;
                top: -2.5rem;
                left: 50%;
                transform: translateX(-50%);
                background: var(--accent);
                color: #000;
                padding: 0.2rem 0.6rem;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 600;
                whiteSpace: nowrap;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s, transform 0.2s;
                z-index: 10;
              }

              .token-wrapper:hover .suggestion-tooltip {
                opacity: 1;
                transform: translateX(-50%) translateY(-5px);
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
};

export default NlpVisualizer;
