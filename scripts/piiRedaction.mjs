#!/usr/bin/env node
/**
 * PII Redaction Utility (P193)
 * Provides utilities for redacting PII from logs
 * 
 * Usage: import { redactPII } from './scripts/piiRedaction.mjs'
 */

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
const SSN_PATTERN = /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g;
const CREDIT_CARD_PATTERN = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
const IP_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

const SENSITIVE_KEYS = [
  'password', 'secret', 'token', 'apiKey', 'api_key',
  'authorization', 'auth', 'cookie', 'session',
  'journal', 'journalContent', 'reflection', 'note',
  'creditCard', 'ssn', 'socialSecurity'
];

export function redactPII(obj, depth = 0) {
  if (depth > 10) return '[MAX_DEPTH]';
  
  if (typeof obj === 'string') {
    return obj
      .replace(EMAIL_PATTERN, '[EMAIL_REDACTED]')
      .replace(PHONE_PATTERN, '[PHONE_REDACTED]')
      .replace(SSN_PATTERN, '[SSN_REDACTED]')
      .replace(CREDIT_CARD_PATTERN, '[CARD_REDACTED]')
      .replace(IP_PATTERN, '[IP_REDACTED]');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => redactPII(item, depth + 1));
  }
  
  if (obj && typeof obj === 'object') {
    const redacted = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some(sk => lowerKey.includes(sk.toLowerCase()));
      
      if (isSensitive) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactPII(value, depth + 1);
      }
    }
    return redacted;
  }
  
  return obj;
}

export function redactString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(EMAIL_PATTERN, '[EMAIL]')
    .replace(PHONE_PATTERN, '[PHONE]')
    .replace(SSN_PATTERN, '[SSN]')
    .replace(CREDIT_CARD_PATTERN, '[CARD]');
}

export function createSafeLogger(logger) {
  return {
    info: (msg, data) => logger.info(msg, data ? redactPII(data) : undefined),
    warn: (msg, data) => logger.warn(msg, data ? redactPII(data) : undefined),
    error: (msg, data) => logger.error(msg, data ? redactPII(data) : undefined),
    debug: (msg, data) => logger.debug(msg, data ? redactPII(data) : undefined),
  };
}

if (process.argv[1]?.endsWith('piiRedaction.mjs')) {
  console.log('\n🔒 PII Redaction Utility');
  console.log('─'.repeat(50));
  
  const testData = {
    email: 'user@example.com',
    phone: '555-123-4567',
    message: 'Contact me at test@email.com or 1-800-555-1234',
    password: 'supersecret123',
    journalContent: 'My private thoughts',
    normal: 'This is normal text',
  };
  
  console.log('\nOriginal:', testData);
  console.log('\nRedacted:', redactPII(testData));
  console.log('\n✅ PII Redaction utility ready\n');
}
