import { useState, type ReactNode } from 'react';
import { HOME_REGIONS, type HomeRegion } from '../../data/demos/flyAndSpeak';
import { ExplainPanel, HypothesisBadge, ResetButton, ToggleGroup } from './shared';

/** 강조 대상 영역 — 선택되면 테두리 + 라벨 표시, 나머지는 흐려진다 */
function Region({
  id,
  focus,
  label,
  children,
  style,
}: {
  id: HomeRegion;
  focus: HomeRegion | null;
  label: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const active = focus === id;
  return (
    <div className="mock__region" data-active={active} style={style}>
      {active && <span className="mock__tag">{label}</span>}
      {children}
    </div>
  );
}

const box = (bg: string, h: number, extra?: React.CSSProperties): React.CSSProperties => ({
  background: bg,
  borderRadius: 8,
  height: h,
  ...extra,
});

function BeforeScreen({ focus }: { focus: HomeRegion | null }) {
  const label = (id: HomeRegion) => HOME_REGIONS.find((r) => r.id === id)!.label;
  return (
    <div className="mock" data-focus={focus ?? undefined} aria-hidden="true">
      <div className="mock__bar">
        <span>FLY&amp;SPEAK</span>
        <span>≡</span>
      </div>
      <Region id="cabin" focus={focus} label={label('cabin')}>
        <div style={box('#eef2f7', 26, { display: 'flex', alignItems: 'center', padding: '0 8px', color: '#5b6b7d' })}>
          🔍 강좌 검색
        </div>
      </Region>
      <Region id="entry" focus={focus} label={label('entry')}>
        <div style={box('#cfe0f1', 64, { padding: 8, fontWeight: 700 })}>이번 달 신규 강좌 배너</div>
      </Region>
      <Region id="layout" focus={focus} label={label('layout')}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {['단어장', '문법', '회화', '퀴즈', '랭킹', '커뮤니티'].map((m) => (
            <div key={m} style={box('#f1f4f8', 40, { display: 'grid', placeItems: 'center', fontSize: 10.5 })}>
              {m}
            </div>
          ))}
        </div>
      </Region>
      <Region id="entry" focus={focus} label={label('entry')}>
        <div style={{ display: 'grid', gap: 4 }}>
          <strong style={{ fontSize: 11 }}>전체 강좌</strong>
          {['여행 영어 기초 · 12강', '비즈니스 회화 · 20강'].map((c) => (
            <div key={c} style={box('#f7f9fc', 26, { border: '1px solid #e3e8ef', padding: '4px 8px' })}>
              {c}
            </div>
          ))}
        </div>
      </Region>
      <Region id="cabin" focus={focus} label={label('cabin')}>
        <div style={box('#f1f4f8', 30, { padding: '6px 8px' })}>🏆 이번 주 랭킹 · 💬 커뮤니티 새 글</div>
      </Region>
    </div>
  );
}

function AfterScreen({ focus }: { focus: HomeRegion | null }) {
  const label = (id: HomeRegion) => HOME_REGIONS.find((r) => r.id === id)!.label;
  return (
    <div className="mock" data-focus={focus ?? undefined} aria-hidden="true">
      <div className="mock__bar">
        <span>FLY&amp;SPEAK</span>
      </div>
      <Region id="cabin" focus={focus} label={label('cabin')}>
        <div style={box('#e6f4ea', 24, { display: 'flex', alignItems: 'center', padding: '0 8px', fontWeight: 600 })}>
          ✈ 오프라인 저장됨 · 연결 없이 학습 가능
        </div>
      </Region>
      <Region id="entry" focus={focus} label={label('entry')}>
        <div style={box('#20344a', 92, { padding: 10, color: '#fff', display: 'grid', alignContent: 'space-between' })}>
          <span style={{ fontSize: 10.5, opacity: 0.85 }}>이어서 하기</span>
          <strong style={{ fontSize: 14 }}>승무원에게 요청하기</strong>
          <span style={{ fontSize: 10.5 }}>▶ 3분 · 2단계부터</span>
        </div>
      </Region>
      <Region id="layout" focus={focus} label={label('layout')}>
        <div style={{ display: 'grid', gap: 6 }}>
          {['상황 학습', '표현 복습', '저장한 표현'].map((m) => (
            <div key={m} style={box('#f1f4f8', 40, { display: 'flex', alignItems: 'center', padding: '0 10px', fontWeight: 600, fontSize: 12 })}>
              {m}
            </div>
          ))}
        </div>
      </Region>
    </div>
  );
}

/** FLY&SPEAK 개선 전후 — 초기 홈 ↔ 간소화한 홈. PC는 좌우, 모바일은 전후 전환 버튼 */
export default function FlyHomeCompare() {
  const [focus, setFocus] = useState<HomeRegion | null>(null);
  const [side, setSide] = useState<'before' | 'after'>('before');
  const region = HOME_REGIONS.find((r) => r.id === focus);

  return (
    <div className="demo">
      <div className="demo-toolbar">
        <ToggleGroup
          label="비교할 영역"
          items={HOME_REGIONS.map((r) => ({ value: r.id, label: r.label }))}
          value={focus}
          onChange={setFocus}
        />
        <ResetButton onClick={() => setFocus(null)} disabled={!focus} />
      </div>

      <ToggleGroup
        className="compare__switch"
        label="화면 전환"
        items={[
          { value: 'before', label: '개선 전' },
          { value: 'after', label: '개선 후' },
        ]}
        value={side}
        onChange={setSide}
      />

      <div className="compare">
        <div className="compare__pane" data-hidden-mobile={side !== 'before'}>
          <span className="compare__label">개선 전 · 초기 홈 화면</span>
          <div className="device">
            <div className="device__screen">
              <BeforeScreen focus={focus} />
            </div>
          </div>
        </div>
        <div className="compare__pane" data-hidden-mobile={side !== 'after'}>
          <span className="compare__label">개선 후 · 간소화한 홈 화면</span>
          <div className="device">
            <div className="device__screen">
              <AfterScreen focus={focus} />
            </div>
          </div>
        </div>
      </div>

      {region ? (
        <ExplainPanel title={region.label} badge={<HypothesisBadge />}>
          <dl>
            <div>
              <dt>개선 전</dt>
              <dd>{region.before}</dd>
            </div>
            <div>
              <dt>개선 후</dt>
              <dd>{region.after}</dd>
            </div>
            <div>
              <dt>바꾼 이유</dt>
              <dd>{region.reason}</dd>
            </div>
          </dl>
        </ExplainPanel>
      ) : (
        <ExplainPanel title="영역을 골라 보세요">
          <p>위의 ‘정보 배치’, ‘학습 진입’, ‘기내 환경 반영’ 버튼을 누르면 양쪽 화면의 해당 영역이 강조되고, 무엇을 왜 바꿨는지 여기에 나와요.</p>
        </ExplainPanel>
      )}
    </div>
  );
}
