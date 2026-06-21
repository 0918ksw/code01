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

## 데이터 출처에 대해

현재 제품 데이터는 분석 로직 시연을 위한 **예시(시드) 값**(`src/data/products.ts`)이에요.
실제 서비스에서는 `src/data/productRepository.ts` 의 `lookupByBarcode` 한 곳만 교체하면 돼요.

- **식품안전나라 식품영양성분DB** (식약처, 품목 C005) — 국내 가공식품 커버리지 우수, API 키 필요
- **Open Food Facts** — 무료·키 불필요, 글로벌 데이터 (한국 커버리지는 보완 필요)

`productRepository.ts` 에 Open Food Facts 연동 예시가 주석으로 들어 있어요. 외부 API 호출은 앱인토스 환경의 네트워크 정책을 확인하세요.

## 샘플 바코드 (시연용)

| 바코드 | 제품 |
|---|---|
| `8801056011234` | 제로 콜라 (제로·무설탕) |
| `8801056050110` | 제로 바닐라 아이스크림 (당알코올 다량) |
| `8801056041113` | 라이트 과일요거트 (라이트 표시) |
| `8801056030112` | 제로슈가 프로틴 |

> 본 앱의 분석은 일반 정보 제공용이며 의학적 조언이 아니에요.
