import { useEffect, useState } from 'react';
import { STAGES, TOUCHPOINTS, type TouchpointId } from '../../data/demos/smartBoarding';
import { ExplainPanel, ResetButton, TabList } from './shared';

const AUTO_MS = 4500;

/** 정류장 전경 — 단계마다 버스 위치와 활성 접점이 바뀐다 */
function Scene({
  stage,
  active,
  onPick,
}: {
  stage: number;
  active: TouchpointId | null;
  onPick: (id: TouchpointId) => void;
}) {
  const s = STAGES[stage];
  const lit = stage >= 1; // 버스 도착 이후 바닥 구역 점등
  const hotspots: { id: TouchpointId; x: number; y: number }[] = [
    { id: 'screen', x: 12.5, y: 48 },
    { id: 'floor', x: 34, y: 88 },
    // 기사석은 버스 앞쪽 창문 위치를 따라 움직인다 (SVG 가로 600 기준 %)
    { id: 'driver', x: ((s.busX + 72) / 600) * 100, y: 46 },
  ];

  return (
    <div className="scene">
      <svg viewBox="0 0 600 300" role="img" aria-label={`정류장 전경: ${s.title}. ${s.summary}`}>
        <rect width="600" height="300" fill="#eef3f9" />
        {/* 도로 */}
        <rect y="200" width="600" height="100" fill="#d9e1ea" />
        <rect y="248" width="600" height="4" fill="#fff" opacity="0.8" />
        {/* 보도와 바닥 안내 */}
        <rect y="186" width="600" height="18" fill="#c9d3de" />
        <g className={active === 'floor' ? 'tp-active' : undefined}>
          <rect x="140" y="188" width="90" height="14" rx="4" fill={lit ? '#a9cbea' : '#dfe8f2'} stroke="#20344a" strokeWidth={lit ? 2 : 0} />
          <text x="185" y="199" textAnchor="middle" fontSize="11" fontWeight="700" fill="#20344a">2번 구역</text>
          <rect x="250" y="188" width="90" height="14" rx="4" fill="#ece8f8" />
          <text x="295" y="199" textAnchor="middle" fontSize="11" fill="#4a5d72">3번 구역</text>
          {stage === 2 && (
            <path d="M160 180 l-14 -8 v5 h-20 v6 h20 v5z" fill="#20344a" transform="translate(30 0)" />
          )}
        </g>
        {/* 정류장 기둥과 화면 */}
        <rect x="70" y="60" width="8" height="128" fill="#20344a" />
        <g className={active === 'screen' ? 'tp-active' : undefined}>
          <rect x="22" y="40" width="110" height="62" rx="8" fill="#fff" stroke="#20344a" strokeWidth="2" />
          <text x="77" y="64" textAnchor="middle" fontSize={stage === 1 ? 16 : 12} fontWeight="700" fill="#20344a">
            {stage === 2 ? '다음 · 3105번' : stage === 1 ? '472 도착' : '472 · 2분'}
          </text>
          <text x="77" y="86" textAnchor="middle" fontSize="11" fill="#4a5d72">
            {stage === 2 ? '7분 · 3번 구역' : '2번 구역에서 승차'}
          </text>
        </g>
        {/* 승객 */}
        {[175, 195].map((x) => (
          <g key={x} transform={`translate(${stage === 2 ? x + 20 : x} 150)`}>
            <circle cx="0" cy="0" r="8" fill="#20344a" />
            <rect x="-7" y="10" width="14" height="24" rx="6" fill="#20344a" />
          </g>
        ))}
        {/* 버스 */}
        <g className="bus" style={{ transform: `translateX(${s.busX}px)` }}>
          <g className={active === 'driver' ? 'tp-active' : undefined}>
            <rect x="40" y="110" width="250" height="90" rx="16" fill="#a9cbea" stroke="#20344a" strokeWidth="2" />
            <rect x="52" y="122" width="40" height="34" rx="5" fill="#fff" />
            {[104, 152, 200, 248].map((x) => (
              <rect key={x} x={x} y="122" width="34" height="34" rx="5" fill="#fff" />
            ))}
            {/* 앞문 */}
            <rect x="52" y="160" width={s.doorOpen ? 6 : 28} height="38" fill={s.doorOpen ? '#20344a' : '#e3eef8'} stroke="#20344a" strokeWidth="1.5" />
            <text x="200" y="182" textAnchor="middle" fontSize="16" fontWeight="700" fill="#20344a">472</text>
            <circle cx="90" cy="202" r="14" fill="#20344a" />
            <circle cx="240" cy="202" r="14" fill="#20344a" />
          </g>
        </g>
      </svg>

      {hotspots.map((h, i) => {
        const tp = TOUCHPOINTS.find((t) => t.id === h.id)!;
        return (
          <button
            key={h.id}
            type="button"
            className="hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            aria-pressed={active === h.id}
            aria-label={`${i + 1}. ${tp.label}`}
            onClick={() => onPick(h.id)}
            tabIndex={-1 /* 같은 기능을 아래 접점 목록이 키보드로 제공 */}
          >
            <span className="hotspot__dot">{i + 1}</span>
          </button>
        );
      })}
    </div>
  );
}

/** 스마트 승차 안내 — 3단계 × 3접점 시뮬레이션. 기본은 수동 진행, 자동 재생은 선택 */
export default function BoardingSimulation() {
  const [stage, setStage] = useState(0);
  const [active, setActive] = useState<TouchpointId | null>(null);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setStage((s) => (s + 1) % STAGES.length), AUTO_MS);
    return () => clearInterval(t);
  }, [auto]);

  const s = STAGES[stage];
  const role = active ? s.roles[active] : null;
  const tpLabel = active ? TOUCHPOINTS.find((t) => t.id === active)!.label : '';

  const reset = () => {
    setStage(0);
    setActive(null);
    setAuto(false);
  };

  return (
    <div className="demo">
      <div className="demo-toolbar">
        <TabList
          label="승차 단계"
          idPrefix="boarding-stage"
          controls="boarding-panel"
          items={STAGES.map((st, i) => ({ value: String(i), label: st.title }))}
          value={String(stage)}
          onChange={(v) => {
            setStage(Number(v));
            setAuto(false);
          }}
        />
      </div>

      <ol className="steps" aria-hidden="true">
        {STAGES.map((st, i) => (
          <li key={st.id} data-done={i < stage} aria-current={i === stage ? 'step' : undefined} />
        ))}
      </ol>

      <div id="boarding-panel" role="tabpanel" aria-labelledby={`boarding-stage-${stage}`} className="demo">
        <Scene stage={stage} active={active} onPick={setActive} />

        <ul className="touch-list" aria-label="서비스 접점">
          {TOUCHPOINTS.map((tp, i) => (
            <li key={tp.id}>
              <button type="button" className="tab" aria-pressed={active === tp.id} onClick={() => setActive(tp.id)}>
                <span className="tp-num" aria-hidden="true">
                  {i + 1}
                </span>
                {tp.label}
              </button>
            </li>
          ))}
        </ul>

        <ExplainPanel title={role ? `${s.title} · ${tpLabel}` : s.title}>
          {role ? (
            <dl>
              <div>
                <dt>누구에게</dt>
                <dd>{role.who}</dd>
              </div>
              <div>
                <dt>무엇을</dt>
                <dd>{role.what}</dd>
              </div>
              <div>
                <dt>왜</dt>
                <dd>{role.why}</dd>
              </div>
            </dl>
          ) : (
            <p>{s.summary} 접점(1~3)을 눌러 각 장치가 누구에게 무엇을 왜 알리는지 확인해 보세요.</p>
          )}
        </ExplainPanel>
      </div>

      <div className="demo-toolbar">
        <div className="tabs">
          <button type="button" className="btn" onClick={() => setStage((v) => Math.max(0, v - 1))} disabled={stage === 0}>
            ← 이전 단계
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setStage((v) => Math.min(STAGES.length - 1, v + 1))}
            disabled={stage === STAGES.length - 1}
          >
            다음 단계 →
          </button>
          <button type="button" className="tab" aria-pressed={auto} onClick={() => setAuto((a) => !a)}>
            {auto ? '⏸ 자동 재생 끄기' : '▶ 자동 재생'}
          </button>
        </div>
        <ResetButton onClick={reset} disabled={stage === 0 && !active && !auto} />
      </div>
    </div>
  );
}
