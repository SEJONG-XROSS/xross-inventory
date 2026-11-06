# XROSS 아이스크림 재고 현황

상품별 재고 수량과 상태(충분 / 부족 / 품절)를 한눈에 확인하는 시연용 대시보드입니다.
서버·DB 없이 프론트엔드 Mock 데이터로 동작합니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
```

## 구조

| 경로 | 내용 |
|---|---|
| `src/config/stock.ts` | **재고 상태 기준값** 기본값·허용 범위, 상태별 라벨·색상 |
| `src/components/ThresholdSettings.tsx` | 화면에서 부족 기준값을 변경하는 설정 다이얼로그 |
| `src/data/products.ts` | Mock 상품 데이터 (이미지, 이름, 수량, 업데이트 시각) |
| `src/lib/stock.ts` | 수량 → 상태 판정, 요약 집계 |
| `src/components/` | 헤더, 요약 카드, 검색·필터 툴바, 상품 카드/표 |
| `public/products/` | 상품 일러스트 (실제 사진으로 교체 시 `imageUrl`만 변경) |

## 재고 상태 기준

| 수량 | 상태 |
|---|---|
| 부족 기준값(기본 10) 이상 | 충분 (초록) |
| 1 ~ 기준값 - 1 | 부족 (주황) |
| 0 | 품절 (빨강) |

부족 기준값은 화면 상단의 **기준 설정** 버튼으로 변경할 수 있으며(1~999개), 브라우저 `localStorage`에 저장되어 새로고침 후에도 유지됩니다.
기본값은 `src/config/stock.ts`의 `DEFAULT_LOW_STOCK_THRESHOLD`에서 바꿀 수 있습니다.

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS v4 · Pretendard
