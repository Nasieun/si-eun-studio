/**
 * 사이트 전역 설정 — 메뉴, 연락 수단, 소개 내용.
 * TODO 표시가 있는 값은 시은님이 공개를 허용한 실제 값으로 바꿔야 합니다 (README의 '채워야 할 내용' 참고).
 */

export const SITE = {
  name: '시은의 경험 설계실',
  nameEn: 'SI EUN EXPERIENCE STUDIO',
  owner: '시은',
  tagline: '사람이 느끼는 작은 불편을 발견하고, 더 나은 경험을 설계합니다.',
  description:
    '관찰에서 시작해 서비스와 화면으로 구체화한 작업들을 소개하는 시은의 UX·서비스 기획 포트폴리오입니다.',
  year: 2026,
} as const;

export const NAV = [
  { href: '/projects', label: '프로젝트' },
  { href: '/approach', label: '나의 설계 방식' },
  { href: '/archive', label: '관찰과 탐구' },
  { href: '/about', label: '소개' },
] as const;

/**
 * 연락 수단 — 공개를 허용한 것만 남깁니다.
 * value가 null이면 화면에 '작성 필요'로 표시되고, 푸터에는 나타나지 않습니다.
 */
export type Contact = {
  kind: 'email' | 'link';
  label: string;
  value: string | null; // email: 주소, link: URL
  display?: string;
};

export const CONTACTS: Contact[] = [
  { kind: 'email', label: '이메일', value: 'sieunsally@hanyang.ac.kr' }, // TODO: 공개할 이메일 주소
  { kind: 'link', label: 'GitHub', value: 'https://github.com/Nasieun', display: 'github.com/Nasieun' }
];

export const ABOUT = {
  paragraphs: [
    '저는 사용자가 무엇을 보고, 느끼고, 어려워하는지에 관심이 있습니다.',
    '기내 학습, 대중교통 이용, 앱 속 정보 탐색처럼 다양한 상황을 관찰하고, 이를 서비스 흐름과 화면으로 구체화합니다.',
    '결과물을 직접 확인하고 수정하며, 더 이해하기 쉽고 사용하기 편한 경험을 만들어가고자 합니다.',
  ],
  interests: ['학습 경험', '이동 경험', '인지와 주의', 'XR'],
  /**
   * 실제로 사용한 도구만 적습니다 (I-3).
   * verified: false 인 항목은 '확인 필요' 표시가 붙습니다 — 직접 써 본 도구인지 확인 후 true로 바꾸거나 삭제하세요.
   */
  tools: [
    { group: '기획·디자인', name: 'Figma', verified: true },
    { group: '문서·정리', name: 'Notion', verified: true },
    { group: '구현 보조', name: 'Claude Code (웹사이트 구현)', verified: true },
  ],
  resumePdf: null as string | null, // P1: '/resume.pdf' 처럼 public/ 아래 파일 경로
};

/** 푸터의 AI 활용 고지 — 상세 내용은 /about#ai-notice */
export const AI_NOTICE =
  '이 웹사이트의 구현·초안 정리에 AI(Claude)를 활용했습니다. 프로젝트의 관찰·판단·검증은 시은의 작업입니다.';
