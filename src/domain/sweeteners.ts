import type { Sweetener } from './types';

// 국내 가공식품에서 자주 보이는 감미료 사전이에요.
// '무설탕/제로'로 표시되어도 아래 감미료가 단맛을 내는 경우가 많아요.
// 단맛 배수·열량·ADI(일일섭취허용량)는 공개 자료(식약처·국제기구)를 바탕으로
// 소비자 안내용으로 정리한 참고 값이에요. 정밀 수치는 제품 표시를 따르세요.
export const SWEETENERS: Sweetener[] = [
  // ── 인공(합성)감미료 ─────────────────────────
  {
    id: 'sucralose',
    name: '수크랄로스',
    aliases: ['sucralose', '수크랄로오스', '수크랄로스(합성감미료)'],
    type: 'artificial',
    summary: '설탕보다 약 600배 단 인공감미료로 열량이 거의 없어요.',
    detail: '설탕에서 만들지만 몸에 거의 흡수되지 않아 혈당과 열량에 영향이 적어요. 열에 비교적 안정적이라 가공식품에 널리 쓰여요.',
    bloodSugarImpact: 0,
    sweetness: 600,
    kcalPerGram: 0,
    adi: '체중 1kg당 하루 15mg',
    cautions: ['aftertaste'],
  },
  {
    id: 'aspartame',
    name: '아스파탐',
    aliases: ['aspartame', 'L-페닐알라닌', '아스파탐(합성감미료)'],
    type: 'artificial',
    summary: '설탕보다 약 200배 단 인공감미료로 열량이 거의 없어요.',
    detail: '아미노산 두 가지로 이뤄져 1g당 4kcal지만 워낙 적게 넣어 열량 기여는 미미해요. 분해 시 페닐알라닌이 나와 페닐케톤뇨증(PKU) 환자는 주의해야 해요. 2023년 WHO 산하 IARC가 "발암 가능(2B)"으로 분류했지만 허용 섭취량은 유지됐어요.',
    bloodSugarImpact: 0,
    sweetness: 200,
    kcalPerGram: 4,
    adi: '체중 1kg당 하루 40mg',
    cautions: ['pku', 'who_2b'],
  },
  {
    id: 'acesulfame_k',
    name: '아세설팜칼륨',
    aliases: ['acesulfame', 'acesulfame k', '아세설팜-k', '아세설팜 k', '아세설팜칼륨(합성감미료)'],
    type: 'artificial',
    summary: '설탕보다 약 200배 단 인공감미료로 열량이 없어요.',
    detail: '단독으로 쓰면 쓴맛·금속맛이 살짝 느껴져 수크랄로스·아스파탐과 함께 섞어 쓰는 경우가 많아요. 몸에 흡수돼도 대사되지 않고 그대로 배출돼요.',
    bloodSugarImpact: 0,
    sweetness: 200,
    kcalPerGram: 0,
    adi: '체중 1kg당 하루 15mg',
    cautions: ['aftertaste'],
  },
  {
    id: 'saccharin',
    name: '사카린나트륨',
    aliases: ['saccharin', '사카린', '삭카린', '사카린나트륨(합성감미료)'],
    type: 'artificial',
    summary: '설탕보다 약 300배 단, 가장 오래 쓰인 인공감미료예요.',
    detail: '과거 발암 논란이 있었지만 인체와 무관한 것으로 정리돼 현재는 안전하게 허용돼요. 많이 넣으면 쓴맛이 나서 소량만 사용해요.',
    bloodSugarImpact: 0,
    sweetness: 300,
    kcalPerGram: 0,
    adi: '체중 1kg당 하루 5mg',
    cautions: ['aftertaste'],
  },
  {
    id: 'neotame',
    name: '네오탐',
    aliases: ['neotame', '네오테임'],
    type: 'artificial',
    summary: '설탕보다 약 7,000~13,000배 단 강력한 인공감미료예요.',
    detail: '아스파탐을 변형한 물질이지만 페닐알라닌이 거의 나오지 않아 PKU 환자도 비교적 안전해요. 극소량만 사용해요.',
    bloodSugarImpact: 0,
    sweetness: 8000,
    kcalPerGram: 0,
    adi: '체중 1kg당 하루 2mg',
    cautions: [],
  },

  // ── 당알코올 ─────────────────────────────────
  {
    id: 'erythritol',
    name: '에리스리톨',
    aliases: ['erythritol', '에리스리톨', '에리스리트'],
    type: 'sugar_alcohol',
    summary: '당알코올 중 혈당·열량 영향이 가장 적은 편이에요.',
    detail: '대부분 소장에서 흡수돼 소변으로 빠져나가, 다른 당알코올보다 설사를 덜 일으키는 편이에요. 다만 한 번에 많이 먹으면 사람에 따라 배가 불편할 수 있어요.',
    bloodSugarImpact: 0,
    sweetness: 0.7,
    kcalPerGram: 0.2,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
  },
  {
    id: 'maltitol',
    name: '말티톨',
    aliases: ['maltitol', '말티톨', '말티톨시럽', '말티톨 시럽'],
    type: 'sugar_alcohol',
    summary: '당알코올이지만 혈당을 어느 정도 올리고 열량도 있어요.',
    detail: '단맛과 식감이 설탕과 비슷해 무설탕 초콜릿·아이스크림에 많이 쓰여요. 혈당지수(GI)가 당알코올 중 높은 편이라 혈당 관리 중이면 양에 주의하세요. 많이 먹으면 설사가 잦아요.',
    bloodSugarImpact: 2,
    sweetness: 0.9,
    kcalPerGram: 2.1,
    adi: '특별한 제한 없음',
    cautions: ['blood_sugar', 'diarrhea'],
  },
  {
    id: 'xylitol',
    name: '자일리톨',
    aliases: ['xylitol', '자일리톨', '키실리톨'],
    type: 'sugar_alcohol',
    summary: '충치 예방으로 알려진 당알코올로 혈당 영향이 설탕보다 낮아요.',
    detail: '입안 세균이 이용하지 못해 충치 예방 효과로 알려졌어요. 반려견에게는 매우 적은 양도 치명적일 수 있으니 주의하세요.',
    bloodSugarImpact: 1,
    sweetness: 1.0,
    kcalPerGram: 2.4,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea', 'dog_toxic'],
  },
  {
    id: 'sorbitol',
    name: '소르비톨',
    aliases: ['sorbitol', '소르비톨', '솔비톨', 'D-소르비톨'],
    type: 'sugar_alcohol',
    summary: '당알코올로 다량 섭취 시 장에 자극을 줄 수 있어요.',
    detail: '보습 효과가 있어 젤리·껌에 많이 쓰여요. 흡수가 느려 한 번에 많이 먹으면 복부 팽만·설사가 생기기 쉬워요.',
    bloodSugarImpact: 1,
    sweetness: 0.6,
    kcalPerGram: 2.6,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
  },
  {
    id: 'lactitol',
    name: '락티톨',
    aliases: ['lactitol', '락티톨'],
    type: 'sugar_alcohol',
    summary: '유당에서 얻는 당알코올로 단맛이 약한 편이에요.',
    detail: '단맛이 설탕의 절반 이하라 다른 감미료와 함께 쓰여요. 대장에서 발효돼 많이 먹으면 가스·설사가 생길 수 있어요.',
    bloodSugarImpact: 1,
    sweetness: 0.4,
    kcalPerGram: 2.0,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
  },
  {
    id: 'isomalt',
    name: '이소말트',
    aliases: ['isomalt', '이소말트', '아이소말트'],
    type: 'sugar_alcohol',
    summary: '설탕에서 만든 당알코올로 사탕·캔디에 많이 쓰여요.',
    detail: '잘 녹지 않고 모양을 잘 유지해 하드캔디에 적합해요. 다량 섭취 시 완하(설사) 작용이 있어요.',
    bloodSugarImpact: 1,
    sweetness: 0.5,
    kcalPerGram: 2.0,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
  },
  {
    id: 'mannitol',
    name: '만니톨',
    aliases: ['mannitol', '만니톨', '마니톨'],
    type: 'sugar_alcohol',
    summary: '흡수가 매우 적은 당알코올로 완하 작용이 강한 편이에요.',
    detail: '몸에 거의 흡수되지 않아 열량 기여가 적지만, 그만큼 설사를 일으키기 쉬워 사용량이 제한적이에요.',
    bloodSugarImpact: 0,
    sweetness: 0.5,
    kcalPerGram: 1.6,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
  },

  // ── 천연 고감미료 ────────────────────────────
  {
    id: 'stevia',
    name: '스테비올배당체',
    aliases: ['stevia', '스테비아', '효소처리스테비아', '스테비올배당체', 'rebaudioside'],
    type: 'natural',
    summary: '스테비아 잎에서 얻는 천연 고감미료로 열량이 거의 없어요.',
    detail: '설탕의 200~300배 달고 혈당에 영향이 거의 없어요. 농도가 높으면 특유의 끝맛(감초 같은 뒷맛)이 느껴질 수 있어요.',
    bloodSugarImpact: 0,
    sweetness: 250,
    kcalPerGram: 0,
    adi: '스테비올 기준 체중 1kg당 하루 4mg',
    cautions: ['aftertaste'],
  },
  {
    id: 'monk_fruit',
    name: '나한과추출물',
    aliases: ['monk fruit', '나한과', '몽크프룻', '나한과추출물', 'luo han guo'],
    type: 'natural',
    summary: '나한과(몽크프룻)에서 얻는 천연 감미료로 열량이 거의 없어요.',
    detail: '모그로사이드라는 성분이 단맛을 내요. 혈당에 영향이 거의 없고 뒷맛이 적어 스테비아 대안으로 자주 쓰여요.',
    bloodSugarImpact: 0,
    sweetness: 175,
    kcalPerGram: 0,
    adi: '특별한 제한 없음',
    cautions: [],
  },
  {
    id: 'thaumatin',
    name: '토마틴',
    aliases: ['thaumatin', '타우마틴', '토마틴'],
    type: 'natural',
    summary: '단백질 성분의 천연 감미료로 향을 살리는 데도 쓰여요.',
    detail: '서아프리카 식물에서 얻는 단백질로 설탕의 약 2,000배 달아요. 단맛이 천천히 올라오고 오래 남는 특징이 있어요.',
    bloodSugarImpact: 0,
    sweetness: 2000,
    kcalPerGram: 4,
    adi: '특별한 제한 없음',
    cautions: ['aftertaste'],
  },
  {
    id: 'licorice',
    name: '감초추출물',
    aliases: ['glycyrrhizin', '감초추출물', '글리시리진', '감초'],
    type: 'natural',
    summary: '감초에서 얻는 천연 감미 성분으로 짠맛을 부드럽게 해줘요.',
    detail: '설탕의 약 200배 달아요. 아주 많이 먹으면 혈압·전해질에 영향을 줄 수 있어 보통 소량만 사용해요.',
    bloodSugarImpact: 0,
    sweetness: 200,
    kcalPerGram: 0,
    adi: '소량 사용 권장',
    cautions: [],
  },

  // ── 희소당 ───────────────────────────────────
  {
    id: 'allulose',
    name: '알룰로스',
    aliases: ['allulose', '알룰로오스', '알룰로스시럽', '알룰로스 시럽', 'psicose'],
    type: 'rare_sugar',
    summary: '설탕과 맛이 비슷하면서 혈당·열량 영향이 적은 희소당이에요.',
    detail: '자연에 미량 존재하는 당으로 단맛은 설탕의 약 70%지만 몸에 거의 흡수되지 않아 열량이 매우 낮아요. 설탕처럼 갈변·식감이 나서 베이킹에도 쓰여요. 한 번에 많이 먹으면 배가 불편할 수 있어요.',
    bloodSugarImpact: 0,
    sweetness: 0.7,
    kcalPerGram: 0.4,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
  },
  {
    id: 'tagatose',
    name: '타가토스',
    aliases: ['tagatose', '타가토스', 'D-타가토스'],
    type: 'rare_sugar',
    summary: '설탕과 단맛이 비슷하면서 혈당 영향이 낮은 희소당이에요.',
    detail: '유당에서 만드는 희소당으로 단맛이 설탕의 약 90%예요. 일부만 흡수돼 열량이 낮지만 많이 먹으면 장이 예민한 사람은 불편할 수 있어요.',
    bloodSugarImpact: 1,
    sweetness: 0.9,
    kcalPerGram: 1.5,
    adi: '특별한 제한 없음',
    cautions: ['diarrhea'],
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
