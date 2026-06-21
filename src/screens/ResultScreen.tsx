import { useEffect, useMemo, useState } from 'react';
import { lookupByBarcode } from '../data/productRepository';
import { analyzeProduct, type AnalysisResult } from '../domain/analysis';
import { personalize } from '../domain/personalize';
import { recommendAlternatives } from '../domain/recommend';
import type { Product, UserProfile } from '../domain/types';
import { AppHeader } from '../components/AppHeader';
import { ScoreRing } from '../components/ScoreRing';
import { NutritionTable } from '../components/NutritionTable';
import { LabelGapCard } from '../components/LabelGapCard';
import { SweetenerCard } from '../components/SweetenerCard';
import { PersonalInsightCard } from '../components/PersonalInsightCard';
import { AlternativeCard } from '../components/AlternativeCard';
import { CLAIM_RULES } from '../domain/labelRules';
import { theme } from '../ui/theme';
import { Card, Pill, PrimaryButton, SectionTitle } from '../ui/primitives';

interface Props {
  barcode: string;
  profile: UserProfile;
  onBack: () => void;
  onScanAgain: () => void;
  onOpenProduct: (barcode: string) => void;
  onOpenProfile: () => void;
}

export function ResultScreen({ barcode, profile, onBack, onScanAgain, onOpenProduct, onOpenProfile }: Props) {
  const [state, setState] = useState<'loading' | 'found' | 'not_found'>('loading');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    setError(null);
    lookupByBarcode(barcode, controller.signal).then((res) => {
      if (controller.signal.aborted) return;
      setProduct(res.product);
      setError(res.error ?? null);
      setState(res.product ? 'found' : 'not_found');
    });
    return () => controller.abort();
  }, [barcode]);

  if (state === 'loading') {
    return (
      <div>
        <AppHeader title="분석 결과" onBack={onBack} />
        <div style={{ padding: theme.space(10), textAlign: 'center', color: theme.color.subtext }}>분석 중이에요…</div>
      </div>
    );
  }

  if (state === 'not_found' || !product) {
    return (
      <div>
        <AppHeader title="분석 결과" onBack={onBack} />
        <div style={{ padding: theme.space(6), textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: theme.space(3) }}>{error ? '⚠️' : '🔍'}</div>
          <div style={{ fontWeight: 700, fontSize: 17, color: theme.color.text }}>
            {error ? '조회 중 문제가 생겼어요' : '등록되지 않은 바코드예요'}
          </div>
          <p style={{ color: theme.color.subtext, fontSize: 14, lineHeight: 1.6, marginTop: theme.space(2) }}>
            {error ? (
              error
            ) : (
              <>
                바코드 <b>{barcode}</b> 에 해당하는 제품을 식약처 DB·시드 데이터에서 찾지 못했어요.
              </>
            )}
          </p>
          <div style={{ marginTop: theme.space(5) }}>
            <PrimaryButton onClick={onScanAgain}>다시 스캔하기</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return <ResultBody product={product} profile={profile} onBack={onBack} onScanAgain={onScanAgain} onOpenProduct={onOpenProduct} onOpenProfile={onOpenProfile} />;
}

function ResultBody({
  product,
  profile,
  onBack,
  onScanAgain,
  onOpenProduct,
  onOpenProfile,
}: { product: Product } & Omit<Props, 'barcode'>) {
  const analysis: AnalysisResult = useMemo(() => analyzeProduct(product), [product]);
  const insights = useMemo(() => personalize(analysis, profile), [analysis, profile]);
  const alternatives = useMemo(() => recommendAlternatives(product), [product]);

  return (
    <div style={{ paddingBottom: theme.space(10) }}>
      <AppHeader title="분석 결과" onBack={onBack} />

      {/* 제품 헤더 + 점수 */}
      <div style={{ display: 'flex', gap: theme.space(4), padding: theme.space(5), alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: theme.color.subtext }}>{product.brand} · {product.category}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: theme.color.text, marginTop: 2 }}>{product.name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: theme.space(3) }}>
            {product.claims.length === 0 && <Pill color={theme.color.subtext}>표시 없음</Pill>}
            {product.claims.map((c) => (
              <Pill key={c} color={theme.color.dark}>{CLAIM_RULES[c].label}</Pill>
            ))}
          </div>
        </div>
        <ScoreRing score={analysis.score} />
      </div>

      <div style={{ padding: `0 ${theme.space(4)}px` }}>
        {/* 표시 vs 실제 간극 — 핵심 */}
        <SectionTitle>표시와 실제, 이 점이 달라요</SectionTitle>
        {analysis.gaps.length === 0 ? (
          <Card>
            <div style={{ color: theme.color.good, fontWeight: 700 }}>✅ 표시와 실제 성분 사이에 눈에 띄는 간극이 없어요.</div>
          </Card>
        ) : (
          analysis.gaps.map((gap, i) => <LabelGapCard key={i} gap={gap} />)
        )}

        {/* 표시 검증 */}
        <SectionTitle>표시 기준 검증</SectionTitle>
        <Card>
          {analysis.claims.length === 0 && (
            <div style={{ color: theme.color.subtext, fontSize: 14 }}>이 제품에는 강조표시가 없어요.</div>
          )}
          {analysis.claims.map((c, i) => (
            <div
              key={c.rule.type}
              style={{
                display: 'flex',
                gap: theme.space(2),
                padding: `${theme.space(2)}px 0`,
                borderTop: i === 0 ? 'none' : `1px solid ${theme.color.border}`,
              }}
            >
              <span style={{ fontSize: 16 }}>{c.meets === null ? '🔎' : c.meets ? '✅' : '🚫'}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: theme.color.text }}>
                  {c.rule.label}
                  {c.meets === false && <span style={{ color: theme.color.warning }}> · 기준 미달</span>}
                  {c.meets === null && <span style={{ color: theme.color.subtext }}> · 상대표시</span>}
                </div>
                <div style={{ fontSize: 13, color: theme.color.subtext, marginTop: 2, lineHeight: 1.5 }}>{c.rule.basis}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* 맞춤 해석 */}
        <SectionTitle action={<EditLink onClick={onOpenProfile} />}>나에게 맞는 해석</SectionTitle>
        {insights.length === 0 ? (
          <Card>
            <div style={{ color: theme.color.subtext, fontSize: 14 }}>
              맞춤 설정에서 관심사를 고르면 내 상황에 맞게 해석해 드려요.
            </div>
          </Card>
        ) : (
          insights.map((ins) => <PersonalInsightCard key={ins.goal} insight={ins} />)
        )}

        {/* 영양성분 */}
        <SectionTitle>영양성분</SectionTitle>
        <NutritionTable perServing={analysis.perServing} per100={analysis.per100} perContainer={analysis.perContainer} />

        {/* 감미료 */}
        {analysis.sweeteners.length > 0 && (
          <>
            <SectionTitle>감미료 풀이</SectionTitle>
            {analysis.sweeteners.map((s) => (
              <SweetenerCard key={s.id} sweetener={s} />
            ))}
          </>
        )}

        {/* 원재료명 */}
        <SectionTitle>원재료명</SectionTitle>
        <Card>
          <div style={{ fontSize: 14, color: theme.color.text, lineHeight: 1.7 }}>{product.ingredients.join(', ')}</div>
        </Card>

        {/* 대안 추천 */}
        <SectionTitle>더 나은 대안</SectionTitle>
        {alternatives.length === 0 ? (
          <Card>
            <div style={{ color: theme.color.good, fontWeight: 700 }}>👍 같은 카테고리에서 이보다 나은 대안을 찾기 어려워요.</div>
          </Card>
        ) : (
          alternatives.map((alt) => (
            <AlternativeCard key={alt.product.barcode} alt={alt} onClick={() => onOpenProduct(alt.product.barcode)} />
          ))
        )}

        <div style={{ marginTop: theme.space(5) }}>
          <PrimaryButton onClick={onScanAgain}>📷 다른 제품 스캔하기</PrimaryButton>
        </div>

        <p style={{ fontSize: 12, color: theme.color.subtext, lineHeight: 1.6, marginTop: theme.space(4), textAlign: 'center' }}>
          본 분석은 일반 정보 제공용이며 의학적 조언이 아니에요. 데이터는 예시(시드) 값이에요.
        </p>
      </div>
    </div>
  );
}

function EditLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ border: 'none', background: 'none', color: theme.color.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
    >
      설정 변경
    </button>
  );
}
