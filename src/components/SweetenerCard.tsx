import type { ReactNode } from 'react';
import type { CautionTag, Sweetener, SweetenerType } from '../domain/types';
import { theme } from '../ui/theme';
import { Card } from '../ui/primitives';

const TYPE_LABEL: Record<SweetenerType, string> = {
  artificial: '인공감미료',
  sugar_alcohol: '당알코올',
  natural: '천연감미료',
  rare_sugar: '희소당',
};

const CAUTION_LABEL: Record<CautionTag, string> = {
  blood_sugar: '혈당 영향',
  diarrhea: '과다 시 복부 불편',
  pku: '페닐케톤뇨증 주의',
  who_2b: 'WHO 2B 분류 이력',
  aftertaste: '뒷맛',
  kids: '어린이 주의',
};

function bloodSugarText(impact: number) {
  return ['거의 없음', '낮음', '보통', '설탕에 가까움'][impact] ?? '거의 없음';
}

export function SweetenerCard({ sweetener }: { sweetener: Sweetener }) {
  return (
    <Card style={{ marginBottom: theme.space(2) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: theme.color.text }}>{sweetener.name}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.color.primary }}>
          {TYPE_LABEL[sweetener.type]}
        </span>
      </div>
      <div style={{ color: theme.color.subtext, fontSize: 14, lineHeight: 1.5, marginBottom: 8 }}>
        {sweetener.summary}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Tag>혈당 영향 {bloodSugarText(sweetener.bloodSugarImpact)}</Tag>
        {sweetener.cautions.map((c) => (
          <Tag key={c}>{CAUTION_LABEL[c]}</Tag>
        ))}
      </div>
    </Card>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: theme.color.surface,
        color: theme.color.subtext,
        fontSize: 12,
        fontWeight: 600,
        padding: '4px 8px',
        borderRadius: 6,
      }}
    >
      {children}
    </span>
  );
}
