import type { AnalysisResult } from './analysis';
import type { HealthGoal, UserProfile } from './types';

export type InsightTone = 'good' | 'neutral' | 'bad';

export interface PersonalInsight {
  goal: HealthGoal;
  tone: InsightTone;
  message: string;
}

export const GOAL_LABEL: Record<HealthGoal, string> = {
  diet: '체중·칼로리 관리',
  blood_sugar: '혈당 관리',
  low_sodium: '나트륨 제한',
  kids: '아이를 위한 선택',
  pregnancy: '임신·수유 중',
  caffeine_sensitive: '카페인 민감',
  sensitive_gut: '예민한 장',
};

/**
 * 분석 결과를 사용자의 목표/상태에 맞춰 한 사람에게 말하듯 해석해요.
 * 같은 제품도 누가 먹느냐에 따라 좋고 나쁨이 달라져요.
 */
export function personalize(result: AnalysisResult, profile: UserProfile): PersonalInsight[] {
  const insights: PersonalInsight[] = [];
  const { per100, perContainer, sweeteners, product } = result;
  const unit = product.nutrition.servingUnit;

  for (const goal of profile.goals) {
    switch (goal) {
      case 'diet': {
        const kcal = perContainer.calories;
        insights.push(
          kcal <= 30
            ? { goal, tone: 'good', message: `한 통을 다 먹어도 ${kcal}kcal로 부담이 적어요.` }
            : kcal <= 120
              ? { goal, tone: 'neutral', message: `한 통 기준 ${kcal}kcal예요. 간식으로는 무난해요.` }
              : { goal, tone: 'bad', message: `한 통이면 ${kcal}kcal예요. 생각보다 열량이 있어요.` },
        );
        break;
      }
      case 'blood_sugar': {
        const bloodSugarSweetener = sweeteners.find((s) => s.bloodSugarImpact >= 2);
        if (per100.sugars >= 5) {
          insights.push({ goal, tone: 'bad', message: `당류가 100${unit}당 ${per100.sugars}g이라 혈당이 오를 수 있어요.` });
        } else if (bloodSugarSweetener) {
          insights.push({ goal, tone: 'neutral', message: `${bloodSugarSweetener.name}은 혈당을 어느 정도 올릴 수 있어요. 양에 주의하세요.` });
        } else {
          insights.push({ goal, tone: 'good', message: '당류와 혈당 영향 감미료가 적어 혈당 관리에 무난해요.' });
        }
        break;
      }
      case 'low_sodium': {
        const sodium = Math.round(per100.sodium);
        insights.push(
          sodium < 120
            ? { goal, tone: 'good', message: `나트륨이 100${unit}당 ${sodium}mg으로 낮은 편이에요.` }
            : { goal, tone: 'bad', message: `나트륨이 100${unit}당 ${sodium}mg이에요. 제한 중이라면 주의하세요.` },
        );
        break;
      }
      case 'kids': {
        const artificial = sweeteners.filter((s) => s.type === 'artificial');
        const caffeine = product.nutrition.caffeine;
        if (caffeine >= 30) {
          insights.push({ goal, tone: 'bad', message: `카페인이 ${caffeine}mg 들어 있어 아이에게는 권하지 않아요.` });
        } else if (artificial.length > 0) {
          insights.push({ goal, tone: 'neutral', message: `${artificial.map((s) => s.name).join(', ')} 같은 인공감미료가 있어요. 가끔이면 괜찮지만 자주는 권하지 않아요.` });
        } else {
          insights.push({ goal, tone: 'good', message: '인공감미료와 카페인이 없어 아이도 비교적 안심이에요.' });
        }
        break;
      }
      case 'pregnancy': {
        const pku = sweeteners.find((s) => s.cautions.includes('pku'));
        const caffeine = product.nutrition.caffeine;
        if (caffeine >= 50) {
          insights.push({ goal, tone: 'bad', message: `카페인이 ${caffeine}mg이에요. 임신 중 카페인은 하루 권장량을 넘기지 않도록 하세요.` });
        } else if (pku) {
          insights.push({ goal, tone: 'neutral', message: `${pku.name}이 들어 있어요. 일반적으로 허용량 내면 문제없지만 표시를 확인하세요.` });
        } else {
          insights.push({ goal, tone: 'good', message: '특별히 주의할 카페인·감미료는 두드러지지 않아요.' });
        }
        break;
      }
      case 'caffeine_sensitive': {
        const caffeine = product.nutrition.caffeine;
        insights.push(
          caffeine === 0
            ? { goal, tone: 'good', message: '카페인이 없어요.' }
            : caffeine < 50
              ? { goal, tone: 'neutral', message: `카페인이 ${caffeine}mg 들어 있어요. 민감하면 오후엔 피하세요.` }
              : { goal, tone: 'bad', message: `카페인이 ${caffeine}mg으로 적지 않아요.` },
        );
        break;
      }
      case 'sensitive_gut': {
        const sugarAlcohols = sweeteners.filter((s) => s.type === 'sugar_alcohol');
        if (sugarAlcohols.length > 0 && product.nutrition.sugarAlcohol >= 5) {
          insights.push({ goal, tone: 'bad', message: `${sugarAlcohols.map((s) => s.name).join(', ')} 같은 당알코올이 ${product.nutrition.sugarAlcohol}g 들어 있어요. 많이 먹으면 배가 불편할 수 있어요.` });
        } else if (sugarAlcohols.length > 0) {
          insights.push({ goal, tone: 'neutral', message: '당알코올이 소량 있어요. 한 번에 많이 먹지 않으면 괜찮아요.' });
        } else {
          insights.push({ goal, tone: 'good', message: '장을 자극할 만한 당알코올이 거의 없어요.' });
        }
        break;
      }
    }
  }

  return insights;
}
