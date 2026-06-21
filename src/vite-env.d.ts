/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 식약처(식품안전나라) OpenAPI 인증키 */
  readonly VITE_MFDS_API_KEY?: string;
  /**
   * API 기본 주소 재정의 (CORS 우회 프록시용).
   * 미지정 시 https://openapi.foodsafetykorea.go.kr/api 를 직접 호출해요.
   */
  readonly VITE_MFDS_BASE_URL?: string;
  /** 바코드연계제품정보 서비스 ID (기본 C005) */
  readonly VITE_MFDS_BARCODE_SERVICE?: string;
  /** 식품영양성분DB 서비스 ID (기본 I2790) */
  readonly VITE_MFDS_NUTRITION_SERVICE?: string;
  /** 바코드 조회 요청 파라미터 이름 (기본 BAR_CD) */
  readonly VITE_MFDS_BARCODE_PARAM?: string;
  /** 영양성분 조회 요청 파라미터 이름 (기본 DESC_KOR) */
  readonly VITE_MFDS_NUTRITION_PARAM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
