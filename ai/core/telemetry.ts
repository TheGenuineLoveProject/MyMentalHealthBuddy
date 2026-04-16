import { redactPII } from './redact.js';

interface TelemetryEvent {
  event:     string;
  engine:    string;
  promptId:  string;
  audience:  string;
  latencyMs: number;
  timestamp: string;
  meta?:     Record<string, unknown>;
}

export function logEvent(event: string, data: Omit<TelemetryEvent, 'event' | 'timestamp'>): void {
  const safe = redactPII(data);
  process.stdout.write(JSON.stringify({ event, timestamp: new Date().toISOString(), ...safe }) + '\n');
}

export const Events = {
  PROMPT_ROUTED:             'prompt_routed',
  PROMPT_EXECUTED:           'prompt_executed',
  CRISIS_DETECTED:           'crisis_detected',
  CONTENT_GENERATED:         'content_generated',
  EMAIL_SEQUENCE_CREATED:    'email_sequence_created',
  SEO_BRIEF_COMPLETED:       'seo_brief_completed',
  INJECTION_BLOCKED:         'injection_blocked',
  DATA_BOUNDARY_VIOLATION:   'data_boundary_violation',
  USER_REFLECTION_COMPLETED: 'user_reflection_completed',
  CONVERSION_TRIGGERED:      'conversion_triggered',
  SUBSCRIPTION_CREATED:      'subscription_created',
  SUBSCRIPTION_CANCELLED:    'subscription_cancelled',
} as const;
