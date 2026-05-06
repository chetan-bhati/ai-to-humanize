import nlp from 'compromise';

/**
 * An enhanced NLP-based text humanizer using Compromise.js.
 */

const transitions = [
  "To be honest,",
  "Think about it this way:",
  "The thing is,",
  "Essentially,",
  "In many ways,",
  "Beyond that,",
  "Interestingly enough,",
  "What's more,",
  "Basically,",
  "At the end of the day,"
];

const patterns: Record<string, string[]> = {
  "artificial intelligence": ["AI", "machine intelligence", "smart systems"],
  "transforming": ["changing", "reshaping", "overhauling", "revamping"],
  "developed": ["built", "created", "put together"],
  "maintained": ["kept up", "supported", "looked after"],
  "automating": ["handling", "taking over", "running"],
  "repetitive": ["boring", "monotonous", "routine"],
  "intelligent": ["smart", "clever", "advanced"],
  "capabilities": ["features", "powers", "tools"],
  "improve": ["boost", "enhance", "help"],
  "efficiency": ["how fast things work", "productivity"],
  "reduce": ["cut down", "lower", "drop"],
  "assist": ["help", "support", "guide"],
  "essential": ["key", "crucial", "vital", "really important"],
  "critical": ["important", "serious"],
  "ensuring": ["making sure", "guaranteeing"],
  "advancements": ["progress", "breakthroughs", "new tech"],
  "furthermore": ["also", "plus", "and another thing"],
  "utilize": ["use", "leverage", "apply"],
  "subsequently": ["later on", "afterwards"],
  "demonstrate": ["show", "point out"],
  "concerning": ["about", "regarding"],
  "facilitate": ["make easier", "help along"],
  "however": ["but", "yet", "though"],
  "modern": ["today's", "current"],
  "software": ["apps", "programs"]
};

export interface AnalysisToken {
  text: string;
  tags: string[];
  suggested?: string;
  isChanged?: boolean;
}

/**
 * Analyzes text and returns tokens with POS tags and suggestions.
 */
export function analyzeText(text: string): AnalysisToken[] {
  const doc = nlp(text);
  const terms = doc.terms().json() as any[];
  
  return terms.map(term => {
    const word = term.text;
    const tags = Object.keys(term.tags || {});
    let suggested = undefined;
    let isChanged = false;

    // Simple synonym replacement logic for visualization
    const lowerWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    if (patterns[lowerWord] && Math.random() > 0.5) {
      const synonyms = patterns[lowerWord];
      suggested = synonyms[Math.floor(Math.random() * synonyms.length)];
      isChanged = true;
    }

    return {
      text: word,
      tags: tags,
      suggested,
      isChanged
    };
  });
}

/**
 * Humanizes text using NLP techniques.
 */
export function humanizeText(text: string): string {
  if (!text.trim()) return "";

  let doc = nlp(text);

  // 1. Convert passive voice to active where possible
  // doc.sentences().toActive(); // This can sometimes be too aggressive, but let's try

  // 2. Simplify overly formal words (using our pattern map)
  let processed = text;
  Object.keys(patterns).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processed = processed.replace(regex, (match) => {
      if (Math.random() > 0.4) {
        const synonyms = patterns[word.toLowerCase()];
        const replacement = synonyms[Math.floor(Math.random() * synonyms.length)];
        if (match[0] === match[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }
      return match;
    });
  });

  // 3. Re-parse with compromise to handle structural changes
  let finalDoc = nlp(processed);
  
  // Apply occasional conversational fillers to sentences
  const sentenceList = finalDoc.sentences().json() as any[];
  const transformed = sentenceList.map(s => {
    let txt = s.text;
    const roll = Math.random();
    
    if (roll < 0.15 && txt.length > 30) {
      const transition = transitions[Math.floor(Math.random() * transitions.length)];
      txt = `${transition} ${txt.charAt(0).toLowerCase()}${txt.slice(1)}`;
    }
    
    return txt;
  });

  return transformed.join(" ");
}

export const getWordCount = (text: string) => text.trim().split(/\s+/).filter(w => w.length > 0).length;
export const getCharCount = (text: string) => text.length;
