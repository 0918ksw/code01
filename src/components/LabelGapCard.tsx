import type { LabelGap } from '../domain/analysis';
import { severityColor, theme } from '../ui/theme';
import { Card } from '../ui/primitives';

const ICON: Record<LabelGap['severity'], string> = {
  info: 'ℹ️',
  caution: '⚠️',
  warning: '🚫',
};

export function LabelGapCard({ gap }: { gap: LabelGap }) {
  const color = severityColor[gap.severity];
  return (
    <Card style={{ borderLeft: `4px solid ${color}`, marginBottom: theme.space(2) }}>
      <div style={{ display: 'flex', gap: theme.space(2) }}>
        <span style={{ fontSize: 18 }}>{ICON[gap.severity]}</span>
        <div>
          <div style={{ fontWeight: 700, color: theme.color.text, fontSize: 15, marginBottom: 4 }}>
            {gap.title}
          </div>
          <div style={{ color: theme.color.subtext, fontSize: 14, lineHeight: 1.5 }}>{gap.detail}</div>
        </div>
      </div>
    </Card>
  );
}
