// 식약처(식품안전나라) OpenAPI 연동 설정이에요.
// 값은 .env 의 VITE_MFDS_* 환경변수로 주입하며, 키가 없으면 연동이 꺼져요.
//
// 식품안전나라 공통 요청 형식:
//   {BASE}/{KEY}/{SERVICE_ID}/{TYPE}/{START}/{END}[/{조건키}={조건값}]
//   예) https://openapi.foodsafetykorea.go.kr/api/{KEY}/C005/json/1/5/BAR_CD=8801234567890

const DEFAULT_BASE = 'https://openapi.foodsafetykorea.go.kr/api';

export const mfdsConfig = {
  apiKey: import.meta.env.VITE_MFDS_API_KEY ?? '',
  // CORS 때문에 브라우저/WebView 직접 호출이 막히면 프록시 주소를 넣어요.
  baseUrl: import.meta.env.VITE_MFDS_BASE_URL ?? DEFAULT_BASE,
  // 바코드 → 제품 기본정보 (바코드연계제품정보)
  barcodeService: import.meta.env.VITE_MFDS_BARCODE_SERVICE ?? 'C005',
  // 제품명/보고번호 → 영양성분 (식품영양성분DB)
  nutritionService: import.meta.env.VITE_MFDS_NUTRITION_SERVICE ?? 'I2790',
} as const;

export function isMfdsEnabled(): boolean {
  return mfdsConfig.apiKey.trim().length > 0;
}
