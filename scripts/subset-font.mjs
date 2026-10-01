// 빌드 후처리: 사이트에 실제로 쓰인 글자만 담은 Pretendard 서브셋을 dist/fonts/에 만든다.
// 전체 웹폰트(동적 서브셋 약 20개 파일·500KB)를 받으면 모바일 첫 화면이 2초 이상 늦어져서,
// 한 파일로 줄이고 font-display: optional로 첫 화면을 막지 않게 한다 (BaseLayout.astro의 @font-face).
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import subsetFont from 'subset-font';

const DIST = 'dist';
const SOURCE = 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2';
const OUT = join(DIST, 'fonts', 'pretendard-subset.woff2');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(html|js)$/.test(entry.name)) yield p;
  }
}

// HTML 본문과 React 데모 번들(데모 문구) 안의 모든 글자를 모은다
const chars = new Set();
for await (const file of walk(DIST)) {
  const text = await readFile(file, 'utf8');
  for (const ch of text) chars.add(ch);
}
// 나중에 문구가 조금 바뀌어도 영문·숫자·기본 문장부호는 항상 포함
for (let c = 0x20; c < 0x7f; c++) chars.add(String.fromCharCode(c));
'·‘’“”…→←↺▶⏸✓◎▾①②③'.split('').forEach((c) => chars.add(c));

const font = await readFile(SOURCE);
const subset = await subsetFont(font, [...chars].join(''), {
  targetFormat: 'woff2',
  // 굵기 축(wght)은 그대로 두어 400~800을 한 파일로 쓴다
});
await mkdir(join(DIST, 'fonts'), { recursive: true });
await writeFile(OUT, subset);
console.log(`Pretendard 서브셋: ${chars.size}자 → ${(subset.length / 1024).toFixed(0)}KB (${OUT})`);
