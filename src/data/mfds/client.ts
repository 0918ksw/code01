import { mfdsConfig } from './config';

// 식품안전나라 OpenAPI 공통 응답 봉투예요.
// {
//   "{SERVICE_ID}": {
//     "total_count": "123",
//     "row": [ { ...필드 } ],
//     "RESULT": { "CODE": "INFO-000", "MSG": "정상처리되었습니다." }
//   }
// }
export interface MfdsResult {
  CODE: string;
  MSG: string;
}

export interface MfdsServiceBody<Row> {
  total_count?: string;
  row?: Row[];
  RESULT?: MfdsResult;
}

export type MfdsRow = Record<string, string>;

const SUCCESS_CODE = 'INFO-000';

/**
 * 식품안전나라 서비스 1건을 호출해 row 배열을 돌려줘요.
 * @param serviceId 서비스 ID (예: 'C005', 'I2790')
 * @param conditions 조건 (예: { BAR_CD: '8801234567890' })
 */
export async function callFoodSafetyApi(
  serviceId: string,
  conditions: Record<string, string> = {},
  options: { start?: number; end?: number; signal?: AbortSignal } = {},
): Promise<MfdsRow[]> {
  const { apiKey, baseUrl } = mfdsConfig;
  if (!apiKey) throw new Error('식약처 API 키가 설정되지 않았어요. (VITE_MFDS_API_KEY)');

  const start = options.start ?? 1;
  const end = options.end ?? 5;
  const condPath = Object.entries(conditions)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  // 경로 끝에 조건을 붙이는 식품안전나라 특유의 URL 구조예요.
  const url =
    `${baseUrl}/${apiKey}/${serviceId}/json/${start}/${end}` + (condPath ? `/${condPath}` : '');

  const res = await fetch(url, { signal: options.signal });
  if (!res.ok) throw new Error(`식약처 API 오류 (HTTP ${res.status})`);

  const json = (await res.json()) as Record<string, MfdsServiceBody<MfdsRow>>;
  const body = json[serviceId];
  if (!body) {
    // 키 오류 등은 RESULT 만 담겨 오기도 해요.
    const fallback = (json as { RESULT?: MfdsResult }).RESULT;
    throw new Error(fallback?.MSG ?? '식약처 API 응답 형식이 올바르지 않아요.');
  }

  const code = body.RESULT?.CODE;
  // INFO-200 = 데이터 없음. 오류가 아니라 빈 결과로 처리해요.
  if (code && code !== SUCCESS_CODE) {
    if (code === 'INFO-200') return [];
    throw new Error(body.RESULT?.MSG ?? `식약처 API 오류 (${code})`);
  }

  return body.row ?? [];
}
