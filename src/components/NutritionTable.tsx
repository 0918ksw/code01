import { useState } from 'react';
import type { NutritionFacts } from '../domain/types';
import { theme } from '../ui/theme';
import { Card } from '../ui/primitives';

type Basis = 'serving' | 'per100' | 'container';

interface Props {
  perServing: NutritionFacts;
  per100: NutritionFacts;
  perContainer: NutritionFacts;
}

interface Row {
  label: string;
  key: keyof NutritionFacts;
  unit: string;
  bold?: boolean;
}

const ROWS: Row[] = [
  { label: '열량', key: 'calories', unit: 'kcal', bold: true },
  { label: '탄수화물', key: 'carbohydrate', unit: 'g' },
  { label: '· 당류', key: 'sugars', unit: 'g' },
  { label: '· 당알코올', key: 'sugarAlcohol', unit: 'g' },
  { label: '단백질', key: 'protein', unit: 'g' },
  { label: '지방', key: 'fat', unit: 'g' },
  { label: '· 포화지방', key: 'saturatedFat', unit: 'g' },
  { label: '· 트랜스지방', key: 'transFat', unit: 'g' },
  { label: '나트륨', key: 'sodium', unit: 'mg' },
  { label: '카페인', key: 'caffeine', unit: 'mg' },
];

export function NutritionTable({ perServing, per100, perContainer }: Props) {
  const [basis, setBasis] = useState<Basis>('serving');
  const data = basis === 'serving' ? perServing : basis === 'per100' ? per100 : perContainer;
  const unitLabel = perServing.servingUnit;

  const tabs: { key: Basis; label: string }[] = [
    { key: 'serving', label: `1회 (${perServing.servingSize}${unitLabel})` },
    { key: 'per100', label: `100${unitLabel}당` },
    { key: 'container', label: '한 통' },
  ];

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${theme.color.border}` }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setBasis(t.key)}
            style={{
              flex: 1,
              padding: theme.space(3),
              border: 'none',
              background: basis === t.key ? theme.color.surface : theme.color.bg,
              color: basis === t.key ? theme.color.text : theme.color.subtext,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: theme.space(2) }}>
        {ROWS.map((row) => {
          const value = data[row.key] as number;
          const indented = row.label.startsWith('·');
          return (
            <div
              key={row.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: `${theme.space(2.5)}px ${theme.space(2)}px`,
                paddingLeft: indented ? theme.space(5) : theme.space(2),
              }}
            >
              <span
                style={{
                  color: indented ? theme.color.subtext : theme.color.text,
                  fontWeight: row.bold ? 700 : 500,
                  fontSize: 14,
                }}
              >
                {row.label}
              </span>
              <span style={{ color: theme.color.text, fontWeight: row.bold ? 800 : 600, fontSize: 14 }}>
                {value}
                {row.unit}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
