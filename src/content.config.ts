import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * 프로젝트 — src/content/projects/<slug>.mdx 하나가 /projects/<slug> 페이지 하나가 된다.
 * 파일 이름이 곧 URL이므로 바꾸면 홈 카드·가치 카드 링크도 함께 바뀐다.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    /** 홈 문제 카드의 질문형 문구 */
    question: z.string(),
    summary: z.string(),
    /** true면 STEP 02 전까지의 자리표시 페이지 */
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { projects };
