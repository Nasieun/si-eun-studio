/**
 * 광고 속 주의와 지각 — 핫스팟 데이터.
 * TODO: 핫스팟 위치·설명은 분석 구조를 보여 주는 예시 초안입니다. 실제 분석 내용과 적용 이론으로 교체하고,
 *       원본 캡처를 쓰는 경우 source·capturedAt을 채우세요.
 */

export type HotspotType = 'attention' | 'confusing' | 'proposal';

export const HOTSPOT_TYPES: Record<HotspotType, { label: string; icon: string }> = {
  attention: { label: '주의를 끄는 요소', icon: '◎' },
  confusing: { label: '정보를 구분하기 어려운 요소', icon: '?' },
  proposal: { label: '개선 제안', icon: '✓' },
};

export type Hotspot = {
  id: string;
  type: HotspotType;
  /** 화면 안 위치 (%) */
  x: number;
  y: number;
  title: string;
  body: string;
  theory: string;
};

export type ScreenBlock = {
  /** 재현 화면의 블록 — 위에서부터 쌓인다 */
  kind: 'banner' | 'chips' | 'grid' | 'price' | 'coupon' | 'filters' | 'summary';
  emphasis?: boolean;
};

export type AppCase = {
  id: 'oliveyoung' | 'musinsa';
  tab: string;
  lens: string;
  screenName: string;
  source: string | null;
  capturedAt: string | null;
  before: { blocks: ScreenBlock[]; hotspots: Hotspot[] };
  after: {
    blocks: ScreenBlock[];
    hotspots: Hotspot[];
    hypothesis: { change: string; effect: string; method: string };
  };
};

export const CASES: AppCase[] = [
  {
    id: 'oliveyoung',
    tab: '올리브영',
    lens: '노출 · 감각 순응',
    screenName: '홈 화면',
    source: null,
    capturedAt: null,
    before: {
      blocks: [{ kind: 'banner' }, { kind: 'chips' }, { kind: 'grid' }, { kind: 'coupon' }],
      hotspots: [
        {
          id: 'oy-b1',
          type: 'attention',
          x: 50,
          y: 20,
          title: '자동으로 넘어가는 큰 배너',
          body: '화면 위쪽의 크고 움직이는 배너가 가장 먼저 시선을 끌어요. 노출은 확실하지만, 몇 초마다 바뀌어서 내용을 끝까지 읽기 어려워요.',
          theory: '노출(exposure): 정보가 감각 기관에 닿는 단계. 닿는 것과 처리되는 것은 달라요.',
        },
        {
          id: 'oy-b2',
          type: 'confusing',
          x: 30,
          y: 58,
          title: '모든 상품에 붙은 같은 할인 배지',
          body: '거의 모든 상품에 같은 색·모양의 할인 배지가 붙어 있어서, 오히려 어떤 혜택이 특별한지 구분되지 않아요.',
          theory: '감각 순응(sensory adaptation): 같은 자극이 반복되면 점점 덜 느끼게 되는 현상이에요.',
        },
        {
          id: 'oy-b3',
          type: 'confusing',
          x: 50,
          y: 88,
          title: '아래쪽에 묻힌 쿠폰 안내',
          body: '실제로 가격을 바꾸는 쿠폰 정보가 작은 글씨로 화면 아래에 있어서 스크롤하지 않으면 보이지 않아요.',
          theory: '노출 위치: 첫 화면 밖의 정보는 노출 기회 자체가 줄어들어요.',
        },
      ],
    },
    after: {
      blocks: [{ kind: 'banner' }, { kind: 'coupon', emphasis: true }, { kind: 'grid', emphasis: true }],
      hotspots: [
        {
          id: 'oy-a1',
          type: 'proposal',
          x: 50,
          y: 20,
          title: '배너 수동 전환 + 현재 위치 표시',
          body: '자동 전환을 멈추고, 몇 번째 배너인지 보여 줘서 원하는 만큼 읽고 넘기게 해요.',
          theory: '노출된 정보가 실제로 처리될 시간을 확보하는 방향이에요.',
        },
        {
          id: 'oy-a2',
          type: 'proposal',
          x: 50,
          y: 40,
          title: '쿠폰 안내를 첫 화면으로',
          body: '가격에 영향을 주는 쿠폰을 배너 바로 아래 고정 영역으로 올렸어요.',
          theory: '중요한 정보의 노출 위치를 앞당겨요.',
        },
        {
          id: 'oy-a3',
          type: 'proposal',
          x: 30,
          y: 68,
          title: '배지 종류를 줄이고 차별화',
          body: '일반 할인은 글자로만 표시하고, 정말 특별한 혜택에만 다른 모양의 배지를 남겼어요.',
          theory: '반복 자극을 줄여 감각 순응을 피하고, 남은 배지의 대비를 키워요.',
        },
      ],
      hypothesis: {
        change: '할인 배지를 특별 혜택에만 남기고, 쿠폰 안내를 첫 화면으로 올림',
        effect: '사용자가 특별 혜택과 쿠폰을 더 빨리 알아차림',
        method: '5명에게 두 화면을 보여 주고 “가장 큰 혜택이 무엇인지” 찾는 데 걸린 시간과 정답률 비교',
      },
    },
  },
  {
    id: 'musinsa',
    tab: '무신사',
    lens: '주의 · 지각',
    screenName: '상품 목록 화면',
    source: null,
    capturedAt: null,
    before: {
      blocks: [{ kind: 'filters' }, { kind: 'grid' }, { kind: 'price' }],
      hotspots: [
        {
          id: 'ms-b1',
          type: 'confusing',
          x: 50,
          y: 12,
          title: '많은 필터 칩, 적용 상태가 잘 보이지 않음',
          body: '필터 칩이 한 줄에 많이 늘어서 있고 선택된 것과 아닌 것의 차이가 작아서, 지금 어떤 조건으로 보고 있는지 알기 어려워요.',
          theory: '지각(perception): 비슷한 모양·색은 같은 무리로 묶여 보여요(유사성).',
        },
        {
          id: 'ms-b2',
          type: 'attention',
          x: 30,
          y: 45,
          title: '큰 상품 이미지',
          body: '상품 사진이 화면 대부분을 차지해서 시선이 먼저 사진으로 가요. 탐색에는 도움이 되지만 가격 정보는 뒤로 밀려요.',
          theory: '주의(attention): 크고 대비가 강한 자극이 먼저 선택돼요.',
        },
        {
          id: 'ms-b3',
          type: 'confusing',
          x: 50,
          y: 82,
          title: '정가·할인율·쿠폰가가 비슷한 크기',
          body: '여러 가격이 비슷한 크기와 굵기로 나란히 있어서, 실제로 내야 하는 금액을 한 번에 알기 어려워요.',
          theory: '시각적 위계가 없으면 무엇이 핵심인지 지각하기 어려워요.',
        },
      ],
    },
    after: {
      blocks: [{ kind: 'summary', emphasis: true }, { kind: 'grid' }, { kind: 'price', emphasis: true }],
      hotspots: [
        {
          id: 'ms-a1',
          type: 'proposal',
          x: 50,
          y: 12,
          title: '적용된 필터 요약 줄',
          body: '선택한 조건만 위쪽에 요약해 보여 주고, 하나씩 지울 수 있게 했어요.',
          theory: '현재 상태를 한곳에 모아 지각 부담을 줄여요.',
        },
        {
          id: 'ms-a2',
          type: 'proposal',
          x: 50,
          y: 82,
          title: '최종가를 가장 크게',
          body: '실제로 내는 금액(쿠폰 적용가)을 가장 크고 굵게, 정가와 할인율은 작게 보조로 두었어요.',
          theory: '크기·굵기 대비로 시각적 위계를 만들어 주의를 핵심 정보로 이끌어요.',
        },
      ],
      hypothesis: {
        change: '최종가를 가장 크게 표시하고, 적용된 필터를 위쪽에 요약',
        effect: '사용자가 상품의 실제 결제 금액과 현재 조건을 더 빨리 파악함',
        method: '5명에게 “조건에 맞는 상품 중 가장 싼 것 찾기” 과제를 주고 두 화면에서 소요 시간과 오답 수 비교',
      },
    },
  },
];
