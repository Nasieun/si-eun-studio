/**
 * FLY&SPEAK 데모 데이터.
 * TODO: 상황 목록·역할극 대본은 PRD 구조에 맞춘 예시 초안입니다. 시은님 시안의 실제 내용으로 교체하세요.
 */

export type Turn = {
  /** 상대(승무원·심사관) 대사 */
  them: string;
  themKo: string;
  choices: { text: string; feedback: string; best?: boolean }[];
};

export type Situation = {
  id: string;
  title: string;
  context: string;
  minutes: number;
  phrases: { en: string; ko: string }[];
  turns: Turn[];
};

export const SITUATIONS: Situation[] = [
  {
    id: 'ask-crew',
    title: '승무원에게 요청하기',
    context: '좌석에서 물이나 담요가 필요할 때',
    minutes: 3,
    phrases: [
      { en: 'Could I have some water, please?', ko: '물 좀 주시겠어요?' },
      { en: 'Could I get a blanket?', ko: '담요 하나 받을 수 있을까요?' },
      { en: 'Thank you so much.', ko: '정말 감사합니다.' },
    ],
    turns: [
      {
        them: 'Hi, what can I get for you?',
        themKo: '안녕하세요, 무엇을 드릴까요?',
        choices: [
          { text: 'Could I have some water, please?', feedback: '정중하게 요청하는 기본 표현이에요.', best: true },
          { text: 'Water.', feedback: '뜻은 통하지만 짧아서 무뚝뚝하게 들릴 수 있어요.' },
        ],
      },
      {
        them: 'Sure. Anything else?',
        themKo: '물론이죠. 더 필요하신 건요?',
        choices: [
          { text: 'Could I get a blanket, too?', feedback: '‘too’로 추가 요청을 자연스럽게 이어 갔어요.', best: true },
          { text: "No, I'm fine. Thank you so much.", feedback: '필요 없을 때 감사 인사로 마무리하는 표현이에요.', best: true },
        ],
      },
    ],
  },
  {
    id: 'immigration',
    title: '입국 심사 준비',
    context: '착륙 전에 심사관 질문을 미리 연습',
    minutes: 4,
    phrases: [
      { en: "I'm here for sightseeing.", ko: '관광하러 왔어요.' },
      { en: "I'll be staying for five days.", ko: '5일 동안 머물 거예요.' },
      { en: "I'm staying at a hotel downtown.", ko: '시내 호텔에 묵어요.' },
    ],
    turns: [
      {
        them: 'What is the purpose of your visit?',
        themKo: '방문 목적이 무엇인가요?',
        choices: [
          { text: "I'm here for sightseeing.", feedback: '목적을 한 문장으로 분명히 말했어요.', best: true },
          { text: 'Yes.', feedback: '질문에 맞지 않는 답이에요. 목적(관광·출장 등)을 말해 주세요.' },
        ],
      },
      {
        them: 'How long will you stay?',
        themKo: '얼마나 머무르시나요?',
        choices: [
          { text: "I'll be staying for five days.", feedback: '기간을 숫자로 정확히 말했어요.', best: true },
          { text: 'At a hotel.', feedback: '숙소를 묻는 질문의 답이에요. 기간을 말해 주세요.' },
        ],
      },
    ],
  },
  {
    id: 'meal',
    title: '기내식 고르기',
    context: '식사 카트가 왔을 때',
    minutes: 2,
    phrases: [
      { en: 'Chicken, please.', ko: '치킨으로 주세요.' },
      { en: 'Could I have orange juice?', ko: '오렌지 주스 주시겠어요?' },
    ],
    turns: [
      {
        them: 'Chicken or beef?',
        themKo: '치킨과 소고기 중 어떤 걸로 하시겠어요?',
        choices: [
          { text: 'Chicken, please.', feedback: '고른 메뉴 + please로 짧고 정중하게 답했어요.', best: true },
          { text: 'I want beef!', feedback: '뜻은 통하지만 ‘Beef, please.’가 더 부드러워요.' },
        ],
      },
      {
        them: 'Anything to drink?',
        themKo: '음료는 무엇으로 하시겠어요?',
        choices: [
          { text: 'Could I have orange juice?', feedback: '요청 표현 ‘Could I have ~?’를 다시 써 봤어요.', best: true },
          { text: 'Just water, please.', feedback: '간단한 요청에 알맞은 표현이에요.', best: true },
        ],
      },
    ],
  },
];

/** 홈 화면 전후 비교 — 강조 영역 3곳 */
export type HomeRegion = 'layout' | 'entry' | 'cabin';

export const HOME_REGIONS: {
  id: HomeRegion;
  label: string;
  before: string;
  after: string;
  reason: string;
}[] = [
  {
    id: 'layout',
    label: '정보 배치',
    before: '단어장·문법·회화·퀴즈·랭킹·커뮤니티 6개 메뉴가 같은 크기로 나열돼 있었어요.',
    after: '기내에서 실제로 쓰는 ‘상황 학습·표현 복습·저장한 표현’ 3개만 남겼어요.',
    reason: '좁은 좌석과 짧은 집중 시간 속에서는 고르는 일 자체가 부담이 돼요. 기내 상황과 관련 없는 메뉴를 덜어 냈어요.',
  },
  {
    id: 'entry',
    label: '학습 진입',
    before: '학습을 시작하려면 배너 아래 강좌 목록에서 강좌 → 단원 → 레슨을 차례로 골라야 했어요.',
    after: '첫 화면 맨 위에 ‘이어서 하기’ 카드를 두고, 예상 소요 시간과 함께 한 번에 시작하게 했어요.',
    reason: '식사·기내 방송 등으로 학습이 자주 끊겨요. 다시 들어왔을 때 바로 이어 가는 것이 중요하다고 판단했어요.',
  },
  {
    id: 'cabin',
    label: '기내 환경 반영',
    before: '검색창·랭킹·커뮤니티처럼 인터넷 연결이 필요한 기능이 첫 화면 곳곳에 있었어요.',
    after: '‘오프라인 저장됨’ 상태를 맨 위에 보여 주고, 연결 없이 되는 기능만 첫 화면에 두었어요.',
    reason: '기내 와이파이는 없거나 유료인 경우가 많아요. 눌렀는데 안 되는 경험을 미리 막는 것이 우선이었어요.',
  },
];
