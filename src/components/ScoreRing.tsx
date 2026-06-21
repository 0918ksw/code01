import type { HealthScore } from '../domain/healthScore';
import { gradeColor } from '../ui/theme';

/** 건강 점수를 원형 게이지로 보여줘요. */
export function ScoreRing({ score, size = 120 }: { score: HealthScore; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score.value / 100);
  const color = gradeColor[score.grade];

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef1f4" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 30, fontWeight: 800, color }}>{score.value}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>등급 {score.grade}</span>
      </div>
    </div>
  );
}
