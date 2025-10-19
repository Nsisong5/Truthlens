/**
 * Mock API for article verification
 * Simulates backend responses with realistic latency and occasional errors
 */

/**
 * Simulates a delay to mimic network latency
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const simulateDelay = (min = 600, max = 1400) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generates mock sources based on text analysis
 * @param {string} text - The article text
 * @param {boolean} isGuest - Whether user is a guest
 * @returns {Array} Array of source objects
 */
const generateMockSources = (text, isGuest = false) => {
  const lowerText = text.toLowerCase();
  const sources = [];

  // Check for credible keywords
  const hasCredibleKeywords = 
    lowerText.includes('who') || 
    lowerText.includes('cdc') || 
    lowerText.includes('research') ||
    lowerText.includes('study') ||
    lowerText.includes('university');

  const hasSkepticalKeywords = 
    lowerText.includes('fake') || 
    lowerText.includes('hoax') ||
    lowerText.includes('conspiracy') ||
    lowerText.includes('unverified');

  if (hasCredibleKeywords) {
    sources.push({
      title: 'World Health Organization Official Report',
      url: 'https://who.int/news/fact-check-example',
      publisher: 'WHO',
      stance: 'supports',
      date: '2024-06-15',
      excerpt: 'Official health guidelines confirm the validity of the claims made in this article regarding public health measures and scientific consensus...'
    });

    sources.push({
      title: 'CDC Fact Check Database Entry',
      url: 'https://cdc.gov/fact-check/example',
      publisher: 'CDC',
      stance: 'supports',
      date: '2024-06-10',
      excerpt: 'Centers for Disease Control data supports the core assertions, with detailed statistical analysis showing correlation with reported findings...'
    });
  }

  if (hasSkepticalKeywords) {
    sources.push({
      title: 'Independent Fact-Checkers Flag Misinformation',
      url: 'https://factcheck.org/example-debunk',
      publisher: 'FactCheck.org',
      stance: 'contradicts',
      date: '2024-06-18',
      excerpt: 'Our investigation found several unsubstantiated claims that lack credible sourcing. Key assertions could not be verified through independent channels...'
    });
  } else {
    sources.push({
      title: 'Reuters Fact Check Analysis',
      url: 'https://reuters.com/fact-check/example',
      publisher: 'Reuters',
      stance: 'neutral',
      date: '2024-06-12',
      excerpt: 'Mixed evidence found. While some aspects align with verified information, other claims require additional context and independent verification...'
    });
  }

  // Add a third source if not guest
  if (!isGuest && sources.length < 3) {
    sources.push({
      title: 'Academic Journal Cross-Reference',
      url: 'https://pubmed.ncbi.nlm.nih.gov/example',
      publisher: 'PubMed',
      stance: 'supports',
      date: '2024-05-28',
      excerpt: 'Peer-reviewed research corroborates several key points mentioned. Methodology appears sound based on current scientific standards...'
    });
  }

  // For guests, limit to 1-2 sources
  return isGuest ? sources.slice(0, 2) : sources.slice(0, 3);
};

/**
 * Calculates a mock truth score based on text characteristics
 * @param {string} text - The article text
 * @returns {number} Score between 0-100
 */
const calculateMockScore = (text) => {
  const lowerText = text.toLowerCase();
  let score = 50; // Base score

  // Positive indicators
  if (lowerText.includes('who')) score += 15;
  if (lowerText.includes('cdc')) score += 15;
  if (lowerText.includes('research') || lowerText.includes('study')) score += 10;
  if (lowerText.includes('university') || lowerText.includes('professor')) score += 10;
  if (text.length > 500) score += 5; // Longer articles get slight boost

  // Negative indicators
  if (lowerText.includes('fake')) score -= 20;
  if (lowerText.includes('hoax')) score -= 25;
  if (lowerText.includes('conspiracy')) score -= 15;
  if (lowerText.includes('unverified') || lowerText.includes('rumor')) score -= 10;

  // Keep score in valid range
  return Math.max(0, Math.min(100, score));
};

/**
 * Determines verdict based on score
 * @param {number} score - Truth score
 * @returns {string} Verdict label
 */
const getVerdict = (score) => {
  if (score >= 70) return 'Likely True';
  if (score >= 40) return 'Uncertain';
  return 'Likely False';
};

/**
 * Determines confidence level
 * @param {number} score - Truth score
 * @param {string} text - Article text
 * @returns {string} Confidence level
 */
const getConfidence = (score, text) => {
  if (text.length < 200) return 'low';
  if (score >= 75 || score <= 25) return 'high';
  if (score >= 60 || score <= 40) return 'medium';
  return 'low';
};

/**
 * Generates a rationale message
 * @param {number} score - Truth score
 * @param {Array} sources - Array of sources
 * @param {string} confidence - Confidence level
 * @returns {string} Rationale text
 */
const generateRationale = (score, sources, confidence) => {
  const supportCount = sources.filter(s => s.stance === 'supports').length;
  const contradictCount = sources.filter(s => s.stance === 'contradicts').length;

  if (score >= 70) {
    return `This article is supported by ${supportCount} independent source${supportCount !== 1 ? 's' : ''} including credible fact-checkers and official organizations. Confidence: ${confidence.charAt(0).toUpperCase() + confidence.slice(1)}.`;
  } else if (score >= 40) {
    return `Mixed evidence found with ${supportCount} supporting and ${contradictCount} contradicting sources. Additional verification recommended. Confidence: ${confidence.charAt(0).toUpperCase() + confidence.slice(1)}.`;
  } else {
    return `Multiple sources contradict key claims in this article. ${contradictCount} authoritative source${contradictCount !== 1 ? 's' : ''} flag potential misinformation. Confidence: ${confidence.charAt(0).toUpperCase() + confidence.slice(1)}.`;
  }
};

/**
 * Main verification function - simulates backend article verification
 * @param {string|null} token - Auth token (null for guest)
 * @param {string} text - Article text to verify
 * @returns {Promise<Object>} Verification result
 * @throws {Error} On validation or simulated server errors
 */
export async function verifyArticle(token, text) {
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error('Article text cannot be empty');
  }

  // Check text length (200KB = ~200,000 chars)
  if (text.length > 200000) {
    throw new Error('Article text exceeds maximum size of 200KB');
  }

  // Simulate network delay
  await simulateDelay();

  // Simulate occasional server errors (8% chance)
  if (Math.random() < 0.08) {
    throw new Error('Server error: Unable to process request. Please try again.');
  }

  const isGuest = !token;

  // Short text handling
  if (text.length < 200) {
    return {
      score: 50,
      verdict: 'Uncertain',
      confidence: 'low',
      rationale: 'Text too short for confident judgement. Please provide more content for accurate verification.',
      sources: generateMockSources(text, isGuest).slice(0, 1)
    };
  }

  // Calculate score and generate response
  const score = calculateMockScore(text);
  const verdict = getVerdict(score);
  const confidence = getConfidence(score, text);
  const sources = generateMockSources(text, isGuest);
  const rationale = generateRationale(score, sources, confidence);

  // Guest users get limited results
  if (isGuest) {
    return {
      score,
      verdict: 'Uncertain', // Guests always get uncertain
      confidence: 'low',
      rationale: 'Limited verification available for guest users. Sign up for full analysis and confidence scores.',
      sources: sources.slice(0, 2) // Only 2 sources for guests
    };
  }

  // Full response for authenticated users
  return {
    score,
    verdict,
    confidence,
    rationale,
    sources
  };
}

/**
 * Helper to check if error is recoverable
 * @param {Error} error - The error object
 * @returns {boolean} Whether retry might succeed
 */
export function isRecoverableError(error) {
  return error.message.includes('Server error') || 
         error.message.includes('network') ||
         error.message.includes('timeout');
}