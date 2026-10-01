/**
 * 나의 설계 방식 — 가치 5개와 각 가치가 드러난 실제 수정 사례 (PRD STEP 03 · 1.3 표).
 * 사례의 anchor는 프로젝트 MDX의 <Case id="..."> 와 같아야 한다 (e2e 테스트가 확인).
 * TODO: 가치–사례 연결은 STEP 02 사례를 바탕으로 한 초안입니다. 시은님이 확정하세요.
 */

export type ValueCase = {
  project: 'fly-and-speak' | 'smart-boarding' | 'ad-attention';
  anchor: string;
  title: string;
  /** V-3: '수정 전 → 수정 후' 한 줄 요약 */
  change: string;
};

export type Value = {
  id: string;
  name: string;
  /** 한 줄 행동 정의 */
  action: string;
  /** 포트폴리오에서 전달할 내용 */
  meaning: string;
  cases: ValueCase[];
};

export const VALUES: Value[] = [
  {
    id: 'responsibility',
    name: '책임',
    action: '사용 환경과 제약을 먼저 확인하고, 작업의 한계를 숨기지 않고 기록해요.',
    meaning: '사용 환경과 제약을 고려하고, 작업의 한계를 명확하게 기록하는 태도',
    cases: [
      {
        project: 'fly-and-speak',
        anchor: 'case-fly-offline',
        title: '연결 없이 되는 기능만 첫 화면에',
        change: '연결이 필요한 기능이 곳곳에 → 오프라인 기능만 첫 화면에',
      },
      {
        project: 'smart-boarding',
        anchor: 'case-board-driver',
        title: '기사석 패널에 승차 완료·교통약자 알림',
        change: '기사가 눈으로만 판단 → 승차 완료·교통약자 알림 표시',
      },
      {
        project: 'ad-attention',
        anchor: 'case-ad-source',
        title: '원본 캡처 대신 재현 화면과 출처 표기',
        change: '원본 화면 그대로 사용 → 재현 화면 + 출처·캡처 시점 표기',
      },
    ],
  },
  {
    id: 'consistency',
    name: '한결같음',
    action: '피드백을 받으면 화면과 문구를 한 번 더 다듬어요.',
    meaning: '피드백을 반영하며 화면과 문구를 꾸준히 다듬는 과정',
    cases: [
      {
        project: 'fly-and-speak',
        anchor: 'case-fly-menu',
        title: '홈 메뉴를 6개에서 3개로',
        change: '같은 크기의 메뉴 6개 → 하는 일 중심의 메뉴 3개',
      },
      {
        project: 'ad-attention',
        anchor: 'case-ad-price',
        title: '최종가를 가장 크게',
        change: '비슷한 크기의 가격 4개 → 최종가 중심 위계',
      },
    ],
  },
  {
    id: 'confidence',
    name: '자신감',
    action: '익숙하지 않은 도구와 표현 방식도 먼저 시도해 봐요.',
    meaning: '새로운 도구와 표현 방식을 시도하는 자세',
    cases: [
      {
        project: 'smart-boarding',
        anchor: 'case-board-floor',
        title: '바닥 안내를 새 접점으로',
        change: '정류장 화면에만 안내 → 바닥 색 띠·승차 방향 화살표 추가',
      },
    ],
  },
  {
    id: 'achievement',
    name: '성취감',
    action: '아이디어를 직접 눌러 볼 수 있는 시안과 데모로 끝까지 만들어요.',
    meaning: '아이디어를 시안과 체험 가능한 결과물로 구체화하는 경험',
    cases: [
      {
        project: 'fly-and-speak',
        anchor: 'case-fly-entry',
        title: '‘이어서 하기’로 한 번에 시작',
        change: '강좌 → 단원 → 레슨 선택 → ‘이어서 하기’ 한 번',
      },
      {
        project: 'smart-boarding',
        anchor: 'case-board-zone',
        title: '정류장 화면에 ‘승차 구역’ 추가',
        change: '번호·시간만 표시 → 승차 구역까지 표시해 세 접점 연결',
      },
    ],
  },
  {
    id: 'passion',
    name: '열정',
    action: '학습·이동·인지처럼 서로 다른 경험을 궁금해하고 파고들어요.',
    meaning: '학습·이동·인지 등 다양한 경험을 탐구하는 관심',
    cases: [
      {
        project: 'ad-attention',
        anchor: 'case-ad-badge',
        title: '할인 배지를 줄이고 차별화',
        change: '모든 상품에 같은 배지 → 특별 혜택에만 다른 배지',
      },
    ],
  },
];

/** 가치 이름 → id (프로젝트 페이지의 가치 태그를 /approach#<id> 로 잇기 위함) */
export const VALUE_ID: Record<string, string> = Object.fromEntries(VALUES.map((v) => [v.name, v.id]));
