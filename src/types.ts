import { Technique, Modifier, Template, AntiPattern } from './data';

export type { Technique, Modifier, Template, AntiPattern };

export interface FormulaState {
  role: string;
  constraints: string;
  technique: string;
  examples: string;
  task: string;
  format: string;
}
