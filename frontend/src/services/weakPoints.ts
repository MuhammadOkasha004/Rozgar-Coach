import { BookOpen, MessageSquare, Brain, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';

export type WeakCategory = 'knowledge' | 'communication' | 'relevance' | 'confidence' | 'general';

export interface WeakPoint {
  area: string;
  category: WeakCategory;
  suggestion: string;
  icon: typeof BookOpen;
  questionNumbers: number[];
}

const CATEGORY_META: Record<WeakCategory, { icon: typeof BookOpen; defaultSuggestion: string }> = {
  knowledge: {
    icon: BookOpen,
    defaultSuggestion:
      'Review this topic thoroughly and make a list of key concepts. Watch 2-3 introductory videos to reinforce understanding.',
  },
  communication: {
    icon: MessageSquare,
    defaultSuggestion:
      'Before answering, pause for 5 seconds, then speak in a clear structure — Point, Example, Conclusion (PEC method).',
  },
  relevance: {
    icon: AlertTriangle,
    defaultSuggestion:
      'Reread the question and answer directly from that angle. Avoid off-topic stories and repeat the question\'s keywords.',
  },
  confidence: {
    icon: Sparkles,
    defaultSuggestion:
      'Practice answering 3 times daily in front of a mirror, record yourself, and adopt a slow, steady pace. Confidence comes from practice.',
  },
  general: {
    icon: Lightbulb,
    defaultSuggestion:
      'Work consciously on this aspect — small daily practice leads to big improvement.',
  },
};

function normalize(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function detectCategory(area: string): WeakCategory {
  const t = normalize(area);
  if (/(technical|knowledge|concept|definition|formula|theory|tool|technology|subject|incorrect|wrong answer|correct answer|answer was)/.test(t)) {
    return 'knowledge';
  }
  if (/(communicat|clarity|fluent|grammar|structure|articulate|sentence|pronunciation|tone of voice|filler)/.test(t)) {
    return 'communication';
  }
  if (/(confiden|nervous|hesitat|stutter|paus|eye contact|presence|conviction)/.test(t)) {
    return 'confidence';
  }
  if (/(relevan|off[- ]topic|on[- ]topic|tangential|unrelated|focused|complete answer)/.test(t)) {
    return 'relevance';
  }
  return 'general';
}

export function buildWeakPoints(
  feedback: { improvementAreas: string[]; questionNumber: number }[],
): WeakPoint[] {
  const merged = new Map<string, WeakPoint>();
  const order: WeakCategory[] = ['knowledge', 'communication', 'relevance', 'confidence', 'general'];

  for (const f of feedback) {
    for (const raw of f.improvementAreas) {
      const area = raw.trim();
      if (!area) continue;
      const key = normalize(area);
      const category = detectCategory(area);
      const existing = merged.get(key);
      if (existing) {
        if (!existing.questionNumbers.includes(f.questionNumber)) {
          existing.questionNumbers.push(f.questionNumber);
        }
      } else {
        merged.set(key, {
          area,
          category,
          suggestion: CATEGORY_META[category].defaultSuggestion,
          icon: CATEGORY_META[category].icon,
          questionNumbers: [f.questionNumber],
        });
      }
    }
  }

  return Array.from(merged.values()).sort(
    (a, b) => order.indexOf(a.category) - order.indexOf(b.category),
  );
}
