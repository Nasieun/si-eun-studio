import { useState } from 'react';
import { CASES, HOTSPOT_TYPES, type AppCase, type Hotspot, type ScreenBlock } from '../../data/demos/adAttention';
import { ExplainPanel, HypothesisBadge, ResetButton, TabList, ToggleGroup } from './shared';

type View = 'before' | 'after';

/** 재현 화면 — 실제 캡처 대신 구조만 단순화해 다시 그린 화면 (권리 리스크 대응) */
function MockBlock({ block }: { block: ScreenBlock }) {
  const em = block.emphasis ? { boxShadow: 'inset 0 0 0 2px #20344a' } : undefined;
  switch (block.kind) {
    case 'banner':
      return <div style={{ height: '24%', borderRadius: 8, background: 'linear-gradient(120deg,#cfe0f1,#e3d9f4)', ...em }} />;
    case 'chips':
      return (
        <div style={{ display: 'flex', gap: 4 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{ flex: 1, height: 22, borderRadius: 999, background: '#eef2f7' }} />
          ))}
        </div>
      );
    case 'filters':
      return (
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ width: 38, height: 18, borderRadius: 999, background: i === 2 || i === 5 ? '#dfe5ec' : '#eef2f7' }} />
          ))}
        </div>
      );
    case 'summary':
      return (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 10, fontWeight: 700, padding: '4px 6px', borderRadius: 8, background: '#e3eef8', ...em }}>
          적용됨: 상의 ✕ · 3만원 이하 ✕
        </div>
      );
    case 'grid':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 8, background: '#f1f4f8', minHeight: 60 }}>
              {block.emphasis ? (
                i === 1 && <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 9, fontWeight: 700, padding: '0 5px', borderRadius: 4, background: '#20344a', color: '#fff' }}>단독</span>
              ) : (
                <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 9, fontWeight: 700, padding: '0 5px', borderRadius: 4, background: '#eba7a7' }}>SALE</span>
              )}
            </div>
          ))}
        </div>
      );
    case 'price':
      return block.emphasis ? (
        <div style={{ padding: '4px 6px', borderRadius: 8, ...em }}>
          <div style={{ fontSize: 9, color: '#5b6b7d' }}>
            <s>59,000</s> 30%
          </div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>38,900원</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 6, fontSize: 11, fontWeight: 600, padding: '4px 6px' }}>
          <span>59,000</span>
          <span>30%</span>
          <span>41,300</span>
          <span>38,900</span>
        </div>
      );
    case 'coupon':
      return (
        <div
          style={{
            padding: block.emphasis ? '6px 8px' : '2px 6px',
            borderRadius: 8,
            background: block.emphasis ? '#e3eef8' : 'transparent',
            fontSize: block.emphasis ? 11 : 8,
            fontWeight: block.emphasis ? 700 : 400,
            color: block.emphasis ? '#20344a' : '#4a5d72',
            ...em,
          }}
        >
          🎟 오늘 쓸 수 있는 쿠폰 2장
        </div>
      );
  }
}

function HotspotButton({ h, n, active, onPick }: { h: Hotspot; n: number; active: boolean; onPick: () => void }) {
  const t = HOTSPOT_TYPES[h.type];
  return (
    <button
      type="button"
      className={`hotspot hotspot--${h.type}`}
      style={{ left: `${h.x}%`, top: `${h.y}%` }}
      aria-pressed={active}
      aria-label={`${n}. ${t.label}: ${h.title}`}
      onClick={onPick}
      tabIndex={-1 /* 같은 기능을 옆 목록이 키보드로 제공 */}
    >
      <span className="hotspot__dot" style={{ position: 'relative' }}>
        {n}
        <span className="hotspot__icon" aria-hidden="true">
          {t.icon}
        </span>
      </span>
    </button>
  );
}

function TypeTag({ type }: { type: Hotspot['type'] }) {
  const t = HOTSPOT_TYPES[type];
  return (
    <span className={`hs-type hs-type--${type}`}>
      <span aria-hidden="true">{t.icon}</span>
      {t.label}
    </span>
  );
}

/** 광고 속 주의와 지각 — 사례 탭 × 기존/개선 제안 토글 × 핫스팟 */
export default function AdHotspots() {
  const [caseId, setCaseId] = useState<AppCase['id']>('oliveyoung');
  const [view, setView] = useState<View>('before');
  const [activeId, setActiveId] = useState<string | null>(null);

  const c = CASES.find((x) => x.id === caseId)!;
  const screen = c[view];
  const active = screen.hotspots.find((h) => h.id === activeId) ?? null;

  const changeCase = (id: AppCase['id']) => {
    setCaseId(id);
    setView('before');
    setActiveId(null);
  };
  const changeView = (v: View) => {
    setView(v);
    setActiveId(null);
  };

  return (
    <div className="demo">
      <div className="demo-toolbar">
        <TabList
          label="분석 사례"
          idPrefix="ad-case"
          controls="ad-panel"
          items={CASES.map((x) => ({ value: x.id, label: `${x.tab} · ${x.lens}` }))}
          value={caseId}
          onChange={changeCase}
        />
        <ResetButton onClick={() => changeCase('oliveyoung')} disabled={caseId === 'oliveyoung' && view === 'before' && !activeId} />
      </div>

      <div id="ad-panel" role="tabpanel" aria-labelledby={`ad-case-${caseId}`} className="demo">
        <ToggleGroup
          label="화면 전환"
          items={[
            { value: 'before', label: '기존 화면' },
            { value: 'after', label: '개선 제안' },
          ]}
          value={view}
          onChange={changeView}
        />

        <ul className="hs-legend" aria-label="핫스팟 유형">
          {(Object.keys(HOTSPOT_TYPES) as Hotspot['type'][]).map((t) => (
            <li key={t}>
              <TypeTag type={t} />
            </li>
          ))}
        </ul>

        <div className="hs-layout">
          <div>
            <div className="device">
              <div className="device__screen">
                <div className="mock" aria-hidden="true">
                  <div className="mock__bar">
                    <span>{c.tab} 재현 화면</span>
                    <span style={{ fontSize: 10, fontWeight: 500 }}>{view === 'before' ? '기존' : '개선 제안'}</span>
                  </div>
                  {screen.blocks.map((b, i) => (
                    <MockBlock key={`${view}-${i}`} block={b} />
                  ))}
                </div>
                {screen.hotspots.map((h, i) => (
                  <HotspotButton key={h.id} h={h} n={i + 1} active={h.id === activeId} onPick={() => setActiveId(h.id)} />
                ))}
              </div>
            </div>
            <p className="source-note" style={{ marginTop: 8, textAlign: 'center' }}>
              {c.tab} {c.screenName}을 분석·비평 목적으로 단순화해 다시 그린 화면이에요.
              <br />
              출처·캡처 시점: {c.source && c.capturedAt ? `${c.source}, ${c.capturedAt}` : <span className="todo">원본 캡처 사용 시 입력 필요</span>}
            </p>
          </div>

          <div className="demo">
            <ol className="hs-list" aria-label={`${c.tab} ${view === 'before' ? '기존 화면' : '개선 제안'} 핫스팟 목록`}>
              {screen.hotspots.map((h, i) => (
                <li key={h.id}>
                  <button type="button" aria-pressed={h.id === activeId} onClick={() => setActiveId(h.id)}>
                    <span className="tp-num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span style={{ display: 'grid', gap: 4 }}>
                      {h.title}
                      <TypeTag type={h.type} />
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {active ? (
              <ExplainPanel title={active.title} badge={active.type === 'proposal' ? <HypothesisBadge /> : <TypeTag type={active.type} />}>
                <p>{active.body}</p>
                <p className="caption">적용한 이론 — {active.theory}</p>
              </ExplainPanel>
            ) : (
              <ExplainPanel title={view === 'before' ? `${c.tab} · ${c.lens}` : '개선 제안'} badge={view === 'after' ? <HypothesisBadge /> : undefined}>
                {view === 'before' ? (
                  <p>번호를 눌러 기존 화면에서 주의를 끄는 요소와 구분하기 어려운 요소를 확인해 보세요.</p>
                ) : (
                  <dl>
                    <div>
                      <dt>변경</dt>
                      <dd>{c.after.hypothesis.change}</dd>
                    </div>
                    <div>
                      <dt>예상 효과</dt>
                      <dd>{c.after.hypothesis.effect}</dd>
                    </div>
                    <div>
                      <dt>확인 방법</dt>
                      <dd>{c.after.hypothesis.method}</dd>
                    </div>
                  </dl>
                )}
              </ExplainPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
