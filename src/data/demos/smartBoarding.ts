/**
 * 스마트 승차 안내 시스템 — 단계별 접점 역할 (PRD STEP 02 · 3.2 표).
 * TODO: PRD에서 '시안 내용 기입'으로 남은 칸입니다. 아래 문구는 구조를 보여 주기 위한 예시 초안이므로
 *       시은님 시안의 실제 내용으로 교체하세요.
 */

export type TouchpointId = 'screen' | 'floor' | 'driver';

export const TOUCHPOINTS: { id: TouchpointId; label: string }[] = [
  { id: 'screen', label: '정류장 화면' },
  { id: 'floor', label: '바닥 안내' },
  { id: 'driver', label: '기사석 패널' },
];

export type Role = { who: string; what: string; why: string };

export const STAGES: {
  id: string;
  title: string;
  summary: string;
  /** 장면 속 버스 위치 (가로 이동량, px 단위 SVG 좌표) */
  busX: number;
  doorOpen: boolean;
  roles: Record<TouchpointId, Role>;
}[] = [
  {
    id: 'waiting',
    title: '① 정류장에서 기다리기',
    summary: '여러 노선이 서는 정류장에서, 내가 탈 버스가 언제 어디에 서는지 미리 알게 해요.',
    busX: 420,
    doorOpen: false,
    roles: {
      screen: {
        who: '기다리는 승객',
        what: '곧 도착할 버스 번호, 남은 시간, 그 버스가 서는 승차 구역 번호',
        why: '버스가 올 때마다 번호를 확인하러 앞으로 나갔다 들어오는 움직임을 줄이기 위해서예요.',
      },
      floor: {
        who: '기다리는 승객',
        what: '승차 구역별 색 띠와 번호 (아직은 은은하게 표시)',
        why: '어디에 서서 기다리면 되는지 처음부터 자리를 정해 주기 위해서예요.',
      },
      driver: {
        who: '버스 기사',
        what: '다음 정류장에서 탑승을 기다리는 승객이 있는지',
        why: '정차가 필요한지 미리 알고 속도와 차선을 준비하게 하기 위해서예요.',
      },
    },
  },
  {
    id: 'arriving',
    title: '② 버스 도착',
    summary: '버스가 들어오는 순간, 승객과 기사가 같은 위치를 보도록 맞춰요.',
    busX: 120,
    doorOpen: false,
    roles: {
      screen: {
        who: '해당 노선 승객',
        what: '“472번 도착 · 2번 구역” 큰 글자 안내',
        why: '도착 직전의 짧은 순간에 한눈에 읽히도록 정보를 하나로 줄였어요.',
      },
      floor: {
        who: '해당 노선 승객',
        what: '2번 구역 바닥 띠 점등',
        why: '화면을 보지 않는 승객도 발밑에서 바로 알아차리게 하기 위해서예요.',
      },
      driver: {
        who: '버스 기사',
        what: '승객이 모여 있는 정차 위치(2번 구역 앞)',
        why: '버스가 엉뚱한 곳에 서서 승객이 뛰어가는 상황을 막기 위해서예요.',
      },
    },
  },
  {
    id: 'boarding',
    title: '③ 승차하기',
    summary: '탑승을 마치고 안전하게 출발할 때까지 필요한 확인을 나눠 맡아요.',
    busX: 120,
    doorOpen: true,
    roles: {
      screen: {
        who: '남아 있는 승객',
        what: '다음으로 도착할 버스 정보로 전환',
        why: '이 버스를 타지 않는 승객이 계속 기다릴 수 있게 정보를 바로 넘겨요.',
      },
      floor: {
        who: '타는 승객',
        what: '앞문 쪽을 가리키는 승차 방향 화살표',
        why: '앞문 승차·뒷문 하차 동선이 엇갈리지 않게 하기 위해서예요.',
      },
      driver: {
        who: '버스 기사',
        what: '승차 완료 여부, 교통약자 탑승 알림',
        why: '모든 승객이 자리를 잡은 뒤 출발하도록 확인을 돕기 위해서예요.',
      },
    },
  },
];
