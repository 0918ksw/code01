import { getAllProducts } from '../data/productRepository';
import { calcHealthScore } from '../domain/healthScore';
import { gradeColor, theme } from '../ui/theme';
import { Card, PrimaryButton, SectionTitle } from '../ui/primitives';

interface Props {
  onScan: () => void;
  onOpenProduct: (barcode: string) => void;
  onOpenProfile: () => void;
}

export function HomeScreen({ onScan, onOpenProduct, onOpenProfile }: Props) {
  const demos = getAllProducts().slice(0, 6);

  return (
    <div style={{ paddingBottom: theme.space(8) }}>
      {/* 히어로 */}
      <div style={{ padding: `${theme.space(8)}px ${theme.space(5)}px ${theme.space(4)}px` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.color.primary, marginBottom: 6 }}>
          FoodCheck · 푸드 체크
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.color.text, margin: 0, lineHeight: 1.35 }}>
          바코드만 찍으면
          <br />
          무설탕·제로의 진짜를 알려줘요
        </h1>
        <p style={{ fontSize: 15, color: theme.color.subtext, lineHeight: 1.6, marginTop: theme.space(3) }}>
          표시와 실제 성분의 간극을 짚어주고, 감미료·영양성분을 내 상황에 맞게 해석해
          더 나은 대안까지 추천해 드려요.
        </p>
      </div>

      <div style={{ padding: `0 ${theme.space(5)}px` }}>
        <PrimaryButton onClick={onScan}>📷 바코드 스캔하기</PrimaryButton>
        <div style={{ height: theme.space(2) }} />
        <PrimaryButton variant="weak" onClick={onOpenProfile}>
          ⚙️ 내 맞춤 설정
        </PrimaryButton>
      </div>

      <div style={{ padding: `0 ${theme.space(4)}px` }}>
        <SectionTitle>샘플로 먼저 보기</SectionTitle>
        {demos.map((p) => {
          const score = calcHealthScore(p);
          return (
            <Card key={p.barcode} style={{ marginBottom: theme.space(2), cursor: 'pointer' }}>
              <div
                role="button"
                onClick={() => onOpenProduct(p.barcode)}
                style={{ display: 'flex', alignItems: 'center', gap: theme.space(3) }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: p.accentColor, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: theme.color.text }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: theme.color.subtext, marginTop: 2 }}>
                    {p.brand} · {p.category}
                  </div>
                </div>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 999, background: gradeColor[score.grade], color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0,
                  }}
                >
                  {score.value}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
