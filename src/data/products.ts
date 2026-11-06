export interface Product {
  id: string
  name: string
  imageUrl: string
  /** 현재 재고 수량 (개) */
  quantity: number
  /** 마지막 수량 업데이트 시각 */
  updatedAt: Date
}

/**
 * 시연용 Mock 데이터.
 * 업데이트 시각은 화면을 연 시점 기준 "n분 전"으로 생성해 언제 시연해도 자연스럽게 보이도록 한다.
 */
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000)

const raw: Array<[id: string, name: string, quantity: number, updatedMinutesAgo: number]> = [
  ['strawberry-cup', '딸기 컵', 3, 2],
  ['vanilla-cone', '바닐라 콘', 24, 14],
  ['choco-bar', '초코 크런치 바', 18, 35],
  ['melon-bar', '메론 바', 0, 48],
  ['cookie-sandwich', '쿠키 샌드', 12, 61],
  ['redbean-bar', '팥 아이스바', 7, 95],
  ['yogurt-tube', '요거트 튜브', 31, 120],
  ['greentea-pint', '녹차 파인트', 0, 7],
  ['mintchoco-cone', '민트초코 콘', 9, 22],
  ['mango-bar', '망고 바', 15, 180],
  ['cookiecream-cup', '쿠키앤크림 컵', 2, 5],
  ['peach-tube', '복숭아 튜브', 10, 260],
  ['soda-bar', '소다 바', 42, 75],
  ['blacksesame-cup', '흑임자 컵', 0, 310],
  ['rocky-pint', '록키로드 파인트', 6, 140],
  ['caramel-cone', '카라멜 콘', 20, 1500],
]

export const products: Product[] = raw.map(([id, name, quantity, ago]) => ({
  id,
  name,
  imageUrl: `/products/${id}.svg`,
  quantity,
  updatedAt: minutesAgo(ago),
}))

export const STORE_NAME = '무인 아이스크림 1호점'
