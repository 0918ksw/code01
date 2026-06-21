import type { Sweetener } from './types';

// 국내 가공식품에서 자주 보이는 감미료 사전이에요.
// '무설탕/제로'로 표시되어도 아래 감미료가 단맛을 내는 경우가 많아요.
// 수치/설명은 소비자 안내용으로 단순화한 예시 값이에요.
export const SWEETENERS: Sweetener[] = [
  {
    id: 'sucralose',
    name: '수크랄로스',
    aliases: ['sucralose', '수크랄로오스'],
    type: 'artificial',
    summary: '설탕보다 약 600배 단 인공감미료로 열량이 거의 없어요.',
    bloodSugarImpact: 0,
    cautions: ['aftertaste'],
  },
  {
    id: 'aspartame',
    name: '아스파탐',
    aliases: ['aspartame', 'L-페닐알라닌'],
    type: 'artificial',
    summary: '열량이 거의 없는 인공감미료지만 페닐알라닌을 함유해요.',
    bloodSugarImpact: 0,
    cautions: ['pku', 'who_2b'],
  },
  {
    id: 'acesulfame_k',
    name: '아세설팜칼륨',
    aliases: ['acesulfame', 'acesulfame k', '아세설팜-k', '아세설팜 k'],
    type: 'artificial',
    summary: '열량이 없는 인공감미료로 다른 감미료와 함께 자주 쓰여요.',
    bloodSugarImpact: 0,
    cautions: ['aftertaste'],
  },
  {
    id: 'saccharin',
    name: '사카린나트륨',
    aliases: ['saccharin', '사카린'],
    type: 'artificial',
    summary: '오래 쓰인 인공감미료로 매우 적은 양으로 단맛을 내요.',
    bloodSugarImpact: 0,
    cautions: ['aftertaste'],
  },
  {
    id: 'erythritol',
    name: '에리스리톨',
    aliases: ['erythritol', '에리스리톨'],
    type: 'sugar_alcohol',
    summary: '당알코올 중 혈당과 칼로리에 영향이 가장 적은 편이에요.',
    bloodSugarImpact: 0,
    cautions: ['diarrhea'],
  },
  {
    id: 'maltitol',
    name: '말티톨',
    aliases: ['maltitol', '말티톨', '말티톨시럽'],
    type: 'sugar_alcohol',
    summary: '당알코올이지만 혈당을 어느 정도 올리고 열량도 있어요.',
    bloodSugarImpact: 2,
    cautions: ['blood_sugar', 'diarrhea'],
  },
  {
    id: 'xylitol',
    name: '자일리톨',
    aliases: ['xylitol', '자일리톨'],
    type: 'sugar_alcohol',
    summary: '당알코올로 혈당 영향이 설탕보다 낮아요.',
    bloodSugarImpact: 1,
    cautions: ['diarrhea'],
  },
  {
    id: 'sorbitol',
    name: '소르비톨',
    aliases: ['sorbitol', '소르비톨', '솔비톨'],
    type: 'sugar_alcohol',
    summary: '당알코올로 다량 섭취 시 장에 자극을 줄 수 있어요.',
    bloodSugarImpact: 1,
    cautions: ['diarrhea'],
  },
  {
    id: 'stevia',
    name: '스테비올배당체',
    aliases: ['stevia', '스테비아', '효소처리스테비아'],
    type: 'natural',
    summary: '스테비아 잎에서 얻는 천연 고감미료로 열량이 거의 없어요.',
    bloodSugarImpact: 0,
    cautions: ['aftertaste'],
  },
  {
    id: 'allulose',
    name: '알룰로스',
    aliases: ['allulose', '알룰로오스', '알룰로스시럽'],
    type: 'rare_sugar',
    summary: '희소당으로 설탕과 맛이 비슷하면서 혈당·칼로리 영향이 적어요.',
    bloodSugarImpact: 0,
    cautions: ['diarrhea'],
  },
  {
    id: 'monk_fruit',
    name: '나한과추출물',
    aliases: ['monk fruit', '나한과', '몽크프룻'],
    type: 'natural',
    summary: '나한과(몽크프룻)에서 얻는 천연 감미료로 열량이 거의 없어요.',
    bloodSugarImpact: 0,
    cautions: [],
  },
];

const SWEETENER_BY_ID = new Map(SWEETENERS.map((s) => [s.id, s]));

export function getSweetener(id: string): Sweetener | undefined {
  return SWEETENER_BY_ID.get(id);
}

export function getSweeteners(ids: string[]): Sweetener[] {
  return ids
    .map((id) => SWEETENER_BY_ID.get(id))
    .filter((s): s is Sweetener => s != null);
}

/**
 * 원재료명 문자열 배열에서 알려진 감미료를 찾아내요.
 * 실제 API 연동 시 원재료명만 있고 감미료 id가 없을 때 사용해요.
 */
export function detectSweetenersFromIngredients(ingredients: string[]): string[] {
  const joined = ingredients.join(',').toLowerCase();
  const found = new Set<string>();
  for (const s of SWEETENERS) {
    const names = [s.name, ...s.aliases];
    if (names.some((n) => joined.includes(n.toLowerCase()))) {
      found.add(s.id);
    }
  }
  return [...found];
}
