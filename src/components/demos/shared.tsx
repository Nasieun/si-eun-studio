import type { ReactNode } from 'react';
import './demos.css';

/** 데모 선택 결과를 보여주는 고정 영역. aria-live로 상태 변화를 스크린 리더에 알린다. */
export function ExplainPanel({ title, children, badge }: { title: string; children: ReactNode; badge?: ReactNode }) {
  return (
    <div className="explain" aria-live="polite" aria-atomic="true">
      <div className="demo-explain__head">
        <h4>{title}</h4>
        {badge}
      </div>
      {children}
    </div>
  );
}

export function ResetButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" className="btn btn--ghost demo-reset" onClick={onClick} disabled={disabled}>
      <span aria-hidden="true">↺</span> 다시 보기
    </button>
  );
}

export function HypothesisBadge() {
  return <span className="badge badge--hypothesis">개선 가설</span>;
}

/**
 * 방향키로 움직이는 탭 목록 (WAI-ARIA tabs 패턴, 자동 활성화).
 * 각 탭은 aria-selected로 상태를 알리고, 선택된 탭만 Tab 순서에 들어간다.
 */
export function TabList<T extends string>({
  label,
  items,
  value,
  onChange,
  idPrefix,
  controls,
}: {
  label: string;
  items: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  idPrefix: string;
  /** 탭이 제어하는 패널 id */
  controls: string;
}) {
  const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = items.findIndex((it) => it.value === value);
    const n = items.length;
    const next =
      e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : e.key === 'ArrowRight' ? (i + 1) % n : (i - 1 + n) % n;
    onChange(items[next].value);
    const el = document.getElementById(`${idPrefix}-${items[next].value}`);
    el?.focus();
  };
  return (
    <div className="tabs" role="tablist" aria-label={label} onKeyDown={move}>
      {items.map((it) => (
        <button
          key={it.value}
          id={`${idPrefix}-${it.value}`}
          type="button"
          role="tab"
          className="tab"
          aria-selected={it.value === value}
          aria-controls={controls}
          tabIndex={it.value === value ? 0 : -1}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** 토글 버튼 묶음 (aria-pressed) — 여러 개 중 하나를 고르되 탭 패널이 없는 경우 */
export function ToggleGroup<T extends string>({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string;
  items: { value: T; label: ReactNode }[];
  value: T | null;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`tabs ${className ?? ''}`} role="group" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.value}
          type="button"
          className="tab"
          aria-pressed={it.value === value}
          onClick={() => onChange(it.value)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
