import { detectSweetenersFromIngredients } from '../../domain/sweeteners';
import type { ClaimType, NutritionFacts, Product } from '../../domain/types';
import type { MfdsRow } from './client';

// ⚙️ 식약처 식품안전나라/공공데이터포털은 서비스·개정 세대마다 응답 필드명이 달라요.
// 그래서 한 항목당 "후보 키 목록"을 두고 먼저 잡히는 값을 써요.
//   · 레거시 식품영양성분DB(I2790): DESC_KOR / SERVING_SIZE / NUTR_CONT1~9
//   · 신형 통합DB(데이터포털): foodNm / servingSize / enerc·chocdf·prot·fatce·sugar·nat …
// 실제 응답에 맞춰 아래 후보만 더하거나 빼면 돼요.

/** 바코드연계제품정보(C005) 응답 후보 필드 */
export const BARCODE_FIELDS = {
  barcode: ['BAR_CD', 'BRCD_NO', 'barcode'],
  name: ['PRDLST_NM', 'PRDT_NM', 'prdlstNm'],
  reportNo: ['PRDLST_REPORT_NO', 'prdlstReportNo'],
  maker: ['BSSH_NM', 'MUFC_NM', 'MAKER_NAME', 'bsshNm'],
  foodType: ['PRDLST_DCNM', 'PRDT_DCNM', 'prdlstDcnm'],
  ingredients: ['RAWMTRL_NM', 'IRDNT_NM', 'RM_NM', 'rawmtrlNm'],
} as const;

/** 식품영양성분DB 응답 후보 필드 (레거시 + 신형) */
export const NUTRITION_FIELDS = {
  name: ['DESC_KOR', 'FOOD_NM_KR', 'foodNm'],
  servingSize: ['SERVING_SIZE', 'Z10500', 'servingSize', 'foodSize'],
  servingUnit: ['SERVING_UNIT', 'servingUnit'],
  calories: ['NUTR_CONT1', 'enerc', 'AMT_NUM1', 'energy'], // 열량 kcal
  carbohydrate: ['NUTR_CONT2', 'chocdf', 'AMT_NUM7'], // 탄수화물 g
  protein: ['NUTR_CONT3', 'prot', 'AMT_NUM3'], // 단백질 g
  fat: ['NUTR_CONT4', 'fatce', 'AMT_NUM4'], // 지방 g
  sugars: ['NUTR_CONT5', 'sugar', 'AMT_NUM8'], // 당류 g
  sodium: ['NUTR_CONT6', 'nat', 'AMT_NUM13'], // 나트륨 mg
  saturatedFat: ['NUTR_CONT8', 'fasat'], // 포화지방 g
  transFat: ['NUTR_CONT9', 'fatrn'], // 트랜스지방 g
  maker: ['MAKER_NAME', 'MUFC_NM', 'makerName'],
  group: ['GROUP_NAME', 'foodLv3Nm', 'FOOD_GROUP', 'groupName'],
} as const;

/** 후보 키 중 처음으로 값이 있는 문자열을 골라요. */
export function pick(row: MfdsRow, keys: readonly string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

/** 후보 키 중 처음으로 잡히는 값을 숫자로 변환해요. (단위·콤마 제거) */
export function pickNum(row: MfdsRow, keys: readonly string[]): number {
  const raw = pick(row, keys);
  if (!raw) return 0;
  const v = Number(raw.replace(/,/g, '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(v) ? v : 0;
}

/** "30g", "1회 제공량(100ml)", "240" + 별도 단위 필드를 합쳐 수치/단위를 정해요. */
export function parseServing(rawSize: string, rawUnit: string): { size: number; unit: 'g' | 'mL' } {
  const num = Number(rawSize.replace(/,/g, '').replace(/[^\d.]/g, ''));
  const unitHint = `${rawUnit} ${rawSize}`;
  const isLiquid = /ml|밀리|리터|\bl\b/i.test(unitHint);
  return {
    size: Number.isFinite(num) && num > 0 ? num : 100,
    unit: isLiquid ? 'mL' : 'g',
  };
}

/** 제품명 문자열에서 강조표시(제로/무설탕/라이트 등)를 추정해요. */
export function detectClaimsFromName(name: string): ClaimType[] {
  const claims: ClaimType[] = [];
  const n = name.replace(/\s/g, '');
  if (/제로|zero/i.test(n)) claims.push('zero');
  if (/무설탕|무가당|sugar\s*free/i.test(n)) claims.push('sugar_free');
  if (/저당/i.test(n)) claims.push('low_sugar');
  if (/라이트|light/i.test(n)) claims.push('light');
  if (/저칼로리|로우칼로리|low\s*cal/i.test(n)) claims.push('low_calorie');
  if (/저나트륨/i.test(n)) claims.push('low_sodium');
  if (/저지방/i.test(n)) claims.push('low_fat');
  return [...new Set(claims)];
}

const ACCENT_COLORS = ['#3182f6', '#15a06e', '#f59f00', '#6d4ad6', '#e07a9b', '#0b6bcb'];

function colorFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENT_COLORS[h % ACCENT_COLORS.length];
}

/**
 * 바코드 제품정보 row + (선택) 영양성분 row 를 우리 Product 모델로 변환해요.
 * 식약처 API에는 원재료명·당알코올·카페인이 빠질 수 있어, 가능한 값만 채우고
 * 감미료는 원재료명(있으면)으로, 없으면 제품명으로 추정해요.
 */
export function mapToProduct(
  barcode: string,
  productRow: MfdsRow,
  nutritionRow: MfdsRow | null,
): Product {
  const name =
    pick(productRow, BARCODE_FIELDS.name) ||
    (nutritionRow ? pick(nutritionRow, NUTRITION_FIELDS.name) : '') ||
    '이름 미상 제품';
  const maker =
    pick(productRow, BARCODE_FIELDS.maker) ||
    (nutritionRow ? pick(nutritionRow, NUTRITION_FIELDS.maker) : '') ||
    '제조사 미상';
  const category =
    pick(productRow, BARCODE_FIELDS.foodType) ||
    (nutritionRow ? pick(nutritionRow, NUTRITION_FIELDS.group) : '') ||
    '기타';

  const serving = nutritionRow
    ? parseServing(pick(nutritionRow, NUTRITION_FIELDS.servingSize), pick(nutritionRow, NUTRITION_FIELDS.servingUnit))
    : { size: 100, unit: 'g' as const };

  const nutrition: NutritionFacts = {
    servingSize: serving.size,
    servingUnit: serving.unit,
    servingsPerContainer: 1, // API로는 알기 어려워 기본 1로 둬요.
    calories: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.calories) : 0,
    carbohydrate: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.carbohydrate) : 0,
    sugars: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.sugars) : 0,
    sugarAlcohol: 0, // 식약처 표준 항목에 없어 0으로 둬요.
    protein: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.protein) : 0,
    fat: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.fat) : 0,
    saturatedFat: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.saturatedFat) : 0,
    transFat: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.transFat) : 0,
    sodium: nutritionRow ? pickNum(nutritionRow, NUTRITION_FIELDS.sodium) : 0,
    caffeine: 0,
  };

  const ingredientsRaw = pick(productRow, BARCODE_FIELDS.ingredients);
  const ingredients = ingredientsRaw
    ? ingredientsRaw.split(/[,/]/).map((s) => s.trim()).filter(Boolean)
    : [];
  const sweetenerIds = detectSweetenersFromIngredients(
    ingredients.length > 0 ? ingredients : [name],
  );

  return {
    barcode,
    name,
    brand: maker,
    category,
    claims: detectClaimsFromName(name),
    ingredients,
    sweetenerIds,
    nutrition,
    accentColor: colorFor(name),
  };
}
