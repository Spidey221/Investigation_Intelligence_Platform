/**
 * Utility to extract a surrounding context window for a regex match
 */
const getContext = (text, index, matchLength, windowSize = 60) => {
  if (!text) return null;
  const start = Math.max(0, index - windowSize);
  const end = Math.min(text.length, index + matchLength + windowSize);
  let excerpt = text.substring(start, end);
  
  if (start > 0) excerpt = '...' + excerpt;
  if (end < text.length) excerpt = excerpt + '...';
  
  return excerpt.replace(/\s+/g, ' ').trim();
};

const extractEmails = (text) => {
  const regex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      type: 'EMAIL',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractPhones = (text) => {
  const regex = /(?:\+91|91)?[6-9]\d{9}/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      type: 'PHONE',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractUrls = (text) => {
  const regex = /https?:\/\/[^\s]+/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      type: 'URL',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractDomains = (text) => {
  // Extract domains standalone or derived from URLs
  // Standalone domain regex (very simplified)
  const regex = /\b(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Avoid matching if it's an email
    const indexBefore = match.index > 0 ? text[match.index - 1] : '';
    if (indexBefore === '@') continue;
    
    // Ignore schema for domain value
    let val = match[0];
    if(val.startsWith('http')) {
       try { val = new URL(val).hostname; } catch(e) {}
    }

    results.push({
      type: 'DOMAIN',
      value: val,
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractIpAddresses = (text) => {
  const regex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      type: 'IP_ADDRESS',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractUpiIds = (text) => {
  // Basic UPI pattern
  const regex = /[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    // Basic exclusion to prevent overlapping with regular emails 
    // real UPI ids usually end with @ybl, @upi, @sbi etc. We'll stick to the user's regex.
    // Ensure it doesn't match a standard email (standard emails have . after @)
    if (match[0].includes('.') && match[0].indexOf('.') > match[0].indexOf('@')) {
      continue; 
    }
    results.push({
      type: 'UPI_ID',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractUsernames = (text) => {
  // @username pattern, avoid matching email domains
  const regex = /@[a-zA-Z0-9_.]+/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
     const indexBefore = match.index > 0 ? text[match.index - 1] : ' ';
     // If preceded by word char, it's likely an email
     if (/\w/.test(indexBefore)) continue;
     
    results.push({
      type: 'USERNAME',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

const extractHashtags = (text) => {
  const regex = /#[a-zA-Z0-9_]+/g;
  const results = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    results.push({
      type: 'HASHTAG',
      value: match[0],
      excerpt: getContext(text, match.index, match[0].length)
    });
  }
  return results;
};

/**
 * Orchestrator to run all extractors
 * @param {string} text - The input evidence text
 * @returns {Array} List of extracted entity objects
 */
const extractAllEntities = (text) => {
  if (!text) return [];
  
  return [
    ...extractEmails(text),
    ...extractPhones(text),
    ...extractUrls(text),
    ...extractDomains(text),
    ...extractIpAddresses(text),
    ...extractUpiIds(text),
    ...extractUsernames(text),
    ...extractHashtags(text)
  ];
};

module.exports = {
  extractAllEntities,
  extractEmails,
  extractPhones,
  extractUrls,
  extractDomains,
  extractIpAddresses,
  extractUpiIds,
  extractUsernames,
  extractHashtags
};
