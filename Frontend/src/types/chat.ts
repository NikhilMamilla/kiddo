import type { TypingMetrics } from './metrics';
import type { BDIResult } from './bdi';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  metrics?: TypingMetrics;
  behavioralDistress?: BDIResult;
}
