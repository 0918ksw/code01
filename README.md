# 푸드 체크 (FoodCheck)

바코드만 찍으면 식품의 영양성분을 분석해, **"무설탕·제로·라이트" 표시와 실제 성분 사이의 간극**을 짚어주는 앱인토스(Apps in Toss) 미니앱이에요.

원재료명·감미료·영양성분표를 일일이 검색하지 않아도, 소비자의 상황(혈당·다이어트·아이·임신 등)에 맞춰 해석해 주고 **더 나은 대안까지** 추천해요.

## 핵심 기능

1. **바코드 스캔** — 카메라로 실시간 인식하거나 번호를 직접 입력
2. **영양성분 분석** — 1회 제공량 / 100g(mL)당 / 한 통 기준으로 환산해 한눈에
3. **표시 vs 실제 간극 검증** — 식약처 강조표시 기준으로 "제로/무설탕/라이트" 표시가 실제와 맞는지 검증
   - 예) "무설탕인데 단맛은 감미료로", "당류 0인데 당알코올이", "라이트인데 나트륨은 그대로", "1회 제공량의 함정"
4. **감미료 풀이** — 아스파탐·수크랄로스·에리스리톨·말티톨 등 감미료의 종류·혈당 영향·주의점 설명
5. **맞춤 해석** — 사용자 프로필(혈당 관리/다이어트/나트륨 제한/아이/임신/카페인 민감/예민한 장)에 따라 같은 제품도 다르게 해석
6. **대안 추천** — 같은 카테고리에서 건강 점수가 더 높은 제품을 이유와 함께 추천

## 기술 스택 (앱인토스 표준)

`create-ait-app` 으로 생성한 앱인토스 **WebView 앱** 구조를 따라요.

- **`@apps-in-toss/web-framework` 2.x** (SDK 2.x — 2026년 3월 이후 업로드 필수 버전)
- **React 18 + Vite 6** (`granite dev` / `ait build` / `ait deploy`)
- **TDS (Toss Design System)** — `@toss/tds-mobile`, `@toss/tds-mobile-ait`
- **`@zxing/browser`** — 브라우저 카메라 기반 바코드 디코딩
- 로컬 저장은 앱인토스 `Storage` 사용, 토스 앱 밖에서는 `localStorage` 로 자동 대체

> 앱인토스 카메라 네이티브 API(`openCamera`)는 **사진 촬영**만 지원하고 실시간 바코드 디코딩은 제공하지 않아, WebView의 브라우저 카메라 + `@zxing/browser` 로 실시간 스캔을 구현했어요. iOS WebView 인라인 재생을 위해 `granite.config.ts` 에 `allowsInlineMediaPlayback` 을 설정했어요.

## 폴더 구조

```
├── granite.config.ts        # 앱인토스 설정 (앱명/브랜드/카메라 권한/WebView 옵션)
├── index.html
├── src/
│   ├── main.tsx             # 진입점 (TDSMobileAITProvider)
│   ├── App.tsx              # 화면 스택 네비게이션
│   ├── screens/            # Home · Scan · Result · Profile
│   ├── components/         # 점수링/영양표/간극카드/감미료/대안 등 UI
│   ├── hooks/             # useBarcodeScanner, useUserProfile
│   ├── domain/           # ★ 분석 엔진 (표시 무관 순수 로직)
│   │   ├── labelRules.ts    # 식약처 강조표시 기준 + 100당/한통 환산
│   │   ├── sweeteners.ts    # 감미료 사전
│   │   ├── analysis.ts      # 표시 vs 실제 간극 탐지
│   │   ├── healthScore.ts   # 건강 점수
│   │   ├── personalize.ts   # 맞춤 해석
│   │   └── recommend.ts     # 대안 추천
│   ├── data/             # 시드 제품 DB + 조회 추상화(API 연동 지점)
│   ├── lib/storage.ts
│   └── ui/               # 테마 · 공통 프리미티브
```

## 실행 방법

```bash
npm install
npm run dev        # granite dev (앱인토스 개발 서버)
# 또는 순수 웹 미리보기
npx vite

npm run typecheck  # tsc --noEmit
npm run build      # ait build (제출용 번들)
npm run deploy     # ait deploy (앱인토스 콘솔 배포)
```

브라우저에서 카메라 스캔은 **HTTPS 또는 localhost** 에서만 동작해요. 데스크톱에서는 카메라 대신 바코드 번호 직접 입력으로 테스트할 수 있어요.

## 데이터 출처: 식약처(식품안전나라) API 연동

바코드 조회는 **시드 DB → 식약처 API** 순서로 동작해요 (`src/data/productRepository.ts`).

```
lookupByBarcode(barcode)
  1) 로컬 시드 DB (오프라인·시연용)
  2) 식약처 API  (src/data/mfds/)
       · 바코드연계제품정보(C005): 바코드 → 제품명/제조사/식품유형
       · 식품영양성분DB(I2790):   제품명 → 영양성분(열량·탄수·당류·단백·지방·나트륨…)
       → mapToProduct() 로 Product 모델 변환
```

### 설정 방법

1. [식품안전나라 OpenAPI](https://www.foodsafetykorea.go.kr/api/openApiInfo.do) 에서 인증키 발급
2. `.env.example` 을 `.env` 로 복사하고 `VITE_MFDS_API_KEY` 입력
3. 키가 없으면 연동은 자동으로 꺼지고 시드 데이터만 사용해요.

### 알아둘 점

- **CORS**: 식품안전나라 API는 교차출처 헤더를 주지 않아, 브라우저/WebView에서 직접 호출하면 막힐 수 있어요. 이럴 땐 프록시를 두고 `VITE_MFDS_BASE_URL` 로 그 주소를 지정하세요. (WebView 네트워크는 앱인토스 환경 정책도 함께 확인)
- **필드명**: 식약처 서비스는 개정/버전마다 응답 필드명이 달라요. 매핑은 `src/data/mfds/mapper.ts` 의 `BARCODE_FIELDS` / `NUTRITION_FIELDS` 한 곳에 모아뒀으니, 구독한 서비스 응답에 맞게 그 상수만 고치면 돼요.
- **빠지는 값**: 식약처 표준 항목에는 당알코올·카페인·원재료명이 없을 수 있어요. 가능한 값만 채우고, 감미료는 (원재료명이 없으면) 제품명에서 추정해요.
- **Open Food Facts** 등 다른 소스를 붙이고 싶으면 `productRepository.ts` 에 같은 패턴으로 단계를 추가하면 돼요.

## 샘플 바코드 (시연용)

| 바코드 | 제품 |
|---|---|
| `8801056011234` | 제로 콜라 (제로·무설탕) |
| `8801056050110` | 제로 바닐라 아이스크림 (당알코올 다량) |
| `8801056041113` | 라이트 과일요거트 (라이트 표시) |
| `8801056030112` | 제로슈가 프로틴 |

> 본 앱의 분석은 일반 정보 제공용이며 의학적 조언이 아니에요.
