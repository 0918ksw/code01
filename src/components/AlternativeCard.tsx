import type { Alternative } from '../domain/recommend';
import { gradeColor, theme } from '../ui/theme';
import { Card } from '../ui/primitives';

export function AlternativeCard({ alt, onClick }: { alt: Alternative; onClick?: () => void }) {
  return (
    <Card
      style={{ marginBottom: theme.space(2), cursor: onClick ? 'pointer' : 'default' }}
    >
      <div role="button" onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: theme.space(3) }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: alt.product.accentColor,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: theme.color.text }}>{alt.product.name}</div>
          <div style={{ fontSize: 13, color: theme.color.good, fontWeight: 600, marginTop: 2 }}>
            {alt.reason} · +{alt.scoreDelta}점
          </div>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            background: gradeColor[alt.score.grade],
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {alt.score.value}
        </div>
      </div>
    </Card>
  );
}
