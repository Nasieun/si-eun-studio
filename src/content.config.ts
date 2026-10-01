import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** 진행 상태 — 정해진 값 중 하나 (PRD STEP 02 · 2.3) */
export const STATUSES = ['완료', '시안 단계', '검증 예정'] as const;
/** AI 활용 범위 — 해당하는 것만 */
export const AI_SCOPES = ['웹사이트 구현', '초안 정리', '보조 일러스트', '품질 점검'] as const;

/** 영어로 적어도 받아서 화면에는 정해진 한국어 값으로 보여 준다 */
const STATUS_ALIASES: Record<string, (typeof STATUSES)[number]> = {
  completed: '완료',
  complete: '완료',
  done: '완료',
  draft: '시안 단계',
  prototype: '시안 단계',
  'in-progress': '시안 단계',
  planned: '검증 예정',
  pending: '검증 예정',
};

const status = z.preprocess(
  (v) => (typeof v === 'string' ? (STATUS_ALIASES[v.trim().toLowerCase()] ?? v.trim()) : v),
  z.enum(STATUSES, { message: `status는 ${STATUSES.join(' / ')} 중 하나로 적어 주세요 (completed·draft·planned도 가능)` }).nullable(),
);

/** team: 개인이면 "개인"·personal·1, 팀이면 인원 숫자(예: 4) 또는 "팀 (4명)"처럼 자유롭게 */
const team = z
  .union([z.string(), z.number().int().positive()])
  .nullable()
  .transform((v) => {
    if (v === null) return null;
    if (typeof v === 'number') return v === 1 ? '개인' : `팀 (${v}명)`;
    const s = v.trim();
    if (/^(personal|solo|individual|개인)$/i.test(s)) return '개인';
    if (/^\d+$/.test(s)) return Number(s) === 1 ? '개인' : `팀 (${s}명)`;
    return s;
  });

/** 기간은 YAML이 날짜로 읽어도 글자로 다룬다 */
const period = z
  .union([z.string(), z.date()])
  .nullable()
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v));

/**
 * 프로젝트 — src/content/projects/<slug>.mdx 하나가 /projects/<slug> 페이지 하나가 된다.
 * 파일 이름이 곧 URL이므로 바꾸면 홈 카드·가치 카드 링크도 함께 바뀐다.
 * null 값은 화면에 '작성 필요'로 표시된다 — 모르는 사실을 지어내지 않기 위함.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    /** 홈 문제 카드의 질문형 문구 */
    question: z.string(),
    /** 히어로 한 줄 요약 */
    summary: z.string(),
    /** 히어로의 본인 기여도 (한 줄) */
    contribution: z.string(),
    /** 이 프로젝트가 보여주는 핵심 역량 */
    skills: z.array(z.string()),
    purpose: z.string(),
    audience: z.string(),
    period,
    /** 개인 / 팀(n명) — 팀이면 role에 기여 범위를 구분해 적는다 */
    team,
    role: z.array(z.string()),
    status,
    aiUsage: z.array(z.enum(AI_SCOPES)),
  }),
});

/**
 * 관찰과 탐구 — src/content/archive/<slug>.md 하나를 추가하면 /archive 에 카드가 하나 생긴다 (A-1).
 */
export const ARCHIVE_KINDS = ['보고서', '논문 분석', '콘텐츠 제작'] as const;

const archive = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/archive' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(ARCHIVE_KINDS),
    order: z.number(),
    /** 카드 요약 3줄 (A-2) */
    observed: z.string(),
    interpreted: z.string(),
    implication: z.string(),
    /** 관련 대표 프로젝트 slug */
    related: z.array(z.string()).default([]),
    /** 원문·출처 (논문은 원문 전체 대신 요약 + 링크) */
    source: z.object({ label: z.string(), url: z.string().optional() }).nullable().default(null),
    /** public/ 아래의 원문 파일 (PDF·카드뉴스 이미지) — 공개 허락을 받은 경우에만 */
    files: z.array(z.object({ label: z.string(), path: z.string() })).default([]),
    /** true면 요약이 확인 전 초안이라는 표시가 카드에 붙는다 */
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, archive };
