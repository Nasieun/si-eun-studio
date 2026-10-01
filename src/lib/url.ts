/**
 * 사이트 내부 경로에 배포 하위 경로(base)를 붙인다.
 * 모든 내부 링크·정적 파일 주소는 이 함수를 거쳐야 GitHub Pages(/저장소이름/)에서도 깨지지 않는다.
 *   url('/projects/fly-and-speak#case-entry') → '/repo/projects/fly-and-speak#case-entry'
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const [p, hash] = path.split('#');
  let full = `${base}${p.startsWith('/') ? p : `/${p}`}`;
  // 페이지 주소는 끝에 / 를 붙인다 — GitHub Pages가 /about → /about/ 로 301 리다이렉트하는 왕복을 없앤다
  if (!/\.[a-z0-9]+$/i.test(full) && !full.endsWith('/')) full += '/';
  return hash !== undefined ? `${full}#${hash}` : full;
}

/** 현재 페이지 경로에서 base를 뗀 값 ('/projects/x') — 메뉴의 현재 위치 표시에 쓴다. */
export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return (p.replace(/\/$/, '') || '/');
}
