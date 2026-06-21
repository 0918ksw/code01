import { GOAL_LABEL } from '../domain/personalize';
import type { HealthGoal } from '../domain/types';
import { AppHeader } from '../components/AppHeader';
import { theme } from '../ui/theme';
import { Card, PrimaryButton } from '../ui/primitives';

interface Props {
  goals: HealthGoal[];
  onToggle: (goal: HealthGoal) => void;
  onBack: () => void;
}

const GOAL_DESC: Record<HealthGoal, string> = {
  diet: '열량을 더 깐깐하게 봐드려요',
  blood_sugar: '당류·당알코올의 혈당 영향을 짚어드려요',
  low_sodium: '나트륨을 우선해서 알려드려요',
  kids: '인공감미료·카페인을 더 보수적으로 봐드려요',
  pregnancy: '카페인·감미료 주의 항목을 알려드려요',
  caffeine_sensitive: '카페인 함량을 먼저 알려드려요',
  sensitive_gut: '당알코올로 인한 장 자극을 짚어드려요',
};

const ALL_GOALS = Object.keys(GOAL_LABEL) as HealthGoal[];

export function ProfileScreen({ goals, onToggle, onBack }: Props) {
  return (
    <div style={{ paddingBottom: theme.space(8) }}>
      <AppHeader title="맞춤 설정" onBack={onBack} />
      <div style={{ padding: theme.space(5) }}>
        <p style={{ color: theme.color.subtext, fontSize: 14, lineHeight: 1.6, marginTop: 0 }}>
          관심사를 고르면 같은 제품도 내 상황에 맞게 해석해 드려요. 여러 개를 골라도 돼요.
        </p>
        {ALL_GOALS.map((goal) => {
          const selected = goals.includes(goal);
          return (
            <Card
              key={goal}
              style={{
                marginBottom: theme.space(2),
                cursor: 'pointer',
                border: `1px solid ${selected ? theme.color.primary : theme.color.border}`,
                background: selected ? '#eef4ff' : theme.color.bg,
              }}
            >
              <div role="button" onClick={() => onToggle(goal)} style={{ display: 'flex', alignItems: 'center', gap: theme.space(3) }}>
                <div
                  style={{
                    width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                    border: `2px solid ${selected ? theme.color.primary : theme.color.border}`,
                    background: selected ? theme.color.primary : 'transparent',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800,
                  }}
                >
                  {selected ? '✓' : ''}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: theme.color.text }}>{GOAL_LABEL[goal]}</div>
                  <div style={{ fontSize: 13, color: theme.color.subtext, marginTop: 2 }}>{GOAL_DESC[goal]}</div>
                </div>
              </div>
            </Card>
          );
        })}
        <div style={{ marginTop: theme.space(4) }}>
          <PrimaryButton onClick={onBack}>완료</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
