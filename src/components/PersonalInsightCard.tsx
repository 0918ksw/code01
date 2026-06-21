import { GOAL_LABEL, type PersonalInsight } from '../domain/personalize';
import { theme, toneColor } from '../ui/theme';
import { Card } from '../ui/primitives';

const TONE_ICON = { good: '✅', neutral: '➖', bad: '⚠️' } as const;

export function PersonalInsightCard({ insight }: { insight: PersonalInsight }) {
  const color = toneColor[insight.tone];
  return (
    <Card style={{ marginBottom: theme.space(2) }}>
      <div style={{ display: 'flex', gap: theme.space(2), alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16 }}>{TONE_ICON[insight.tone]}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 2 }}>
            {GOAL_LABEL[insight.goal]}
          </div>
          <div style={{ fontSize: 14, color: theme.color.text, lineHeight: 1.5 }}>{insight.message}</div>
        </div>
      </div>
    </Card>
  );
}
