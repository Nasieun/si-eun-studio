import { useEffect, useRef, useState } from 'react';
import { SITUATIONS, type Situation } from '../../data/demos/flyAndSpeak';
import { ResetButton } from './shared';

type Phase = 'pick' | 'phrases' | 'roleplay' | 'done';

const PHASES: { id: Phase; label: string }[] = [
  { id: 'pick', label: '상황 선택' },
  { id: 'phrases', label: '핵심 표현' },
  { id: 'roleplay', label: '역할극' },
  { id: 'done', label: '완료' },
];

/** FLY&SPEAK 결과 체험 — 상황 선택 → 핵심 표현 → 짧은 역할극 → 완료 */
export default function FlyLearningFlow() {
  const [phase, setPhase] = useState<Phase>('pick');
  const [situation, setSituation] = useState<Situation | null>(null);
  const [turn, setTurn] = useState(0);
  /** 턴별로 고른 선택지 번호 */
  const [answers, setAnswers] = useState<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);

  // 화면이 바뀌면 새 화면 제목으로 포커스를 옮겨 키보드·스크린 리더 사용자가 위치를 잃지 않게 한다
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [phase, turn]);

  const reset = () => {
    setPhase('pick');
    setSituation(null);
    setTurn(0);
    setAnswers([]);
  };

  const pick = (s: Situation) => {
    setSituation(s);
    setPhase('phrases');
  };

  const answer = (i: number) => setAnswers((a) => [...a.slice(0, turn), i]);
  const answered = answers[turn] !== undefined;

  const nextTurn = () => {
    if (!situation) return;
    if (turn + 1 < situation.turns.length) setTurn(turn + 1);
    else setPhase('done');
  };

  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  return (
    <div className="demo">
      <div className="demo-toolbar">
        <ol className="steps" aria-label="학습 흐름 단계" style={{ flex: 1, minWidth: 220 }}>
          {PHASES.map((p, i) => (
            <li key={p.id} data-done={i < phaseIndex} aria-current={i === phaseIndex ? 'step' : undefined}>
              {p.label}
            </li>
          ))}
        </ol>
        <ResetButton onClick={reset} disabled={phase === 'pick'} />
      </div>

      <p className="visually-hidden" aria-live="polite">
        {`${phaseIndex + 1}단계 ${PHASES[phaseIndex].label}${situation ? ` · ${situation.title}` : ''}`}
      </p>

      <div className="device">
        <div className="device__screen">
          <div className="mock">
            <div className="mock__bar">
              <span>FLY&amp;SPEAK</span>
              <span style={{ fontWeight: 500, fontSize: 10 }}>✈ 오프라인</span>
            </div>

            {phase === 'pick' && (
              <>
                <h3 ref={headingRef} tabIndex={-1} style={{ fontSize: 14 }}>
                  지금 어떤 상황인가요?
                </h3>
                {SITUATIONS.map((s) => (
                  <button key={s.id} type="button" className="mock-card" onClick={() => pick(s)}>
                    <strong>{s.title}</strong>
                    {s.context} · {s.minutes}분
                  </button>
                ))}
              </>
            )}

            {phase === 'phrases' && situation && (
              <>
                <h3 ref={headingRef} tabIndex={-1} style={{ fontSize: 14 }}>
                  {situation.title} — 핵심 표현
                </h3>
                {situation.phrases.map((p) => (
                  <div className="phrase" key={p.en} lang="en">
                    <strong>{p.en}</strong>
                    <span lang="ko">{p.ko}</span>
                  </div>
                ))}
                <button type="button" className="mock-primary" onClick={() => setPhase('roleplay')}>
                  역할극 시작하기
                </button>
              </>
            )}

            {phase === 'roleplay' && situation && (
              <>
                <h3 ref={headingRef} tabIndex={-1} style={{ fontSize: 14 }}>
                  역할극 {turn + 1} / {situation.turns.length}
                </h3>
                <div className="chat">
                  {situation.turns.slice(0, turn + 1).map((t, ti) => (
                    <div key={ti} className="chat">
                      <p className="bubble bubble--them" lang="en">
                        {t.them}
                        <small lang="ko">{t.themKo}</small>
                      </p>
                      {answers[ti] !== undefined && (
                        <p className="bubble bubble--me" lang="en">
                          {t.choices[answers[ti]].text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {!answered ? (
                  <div role="group" aria-label="응답 고르기" style={{ display: 'grid', gap: 6, marginTop: 'auto' }}>
                    {situation.turns[turn].choices.map((c, ci) => (
                      <button key={ci} type="button" className="mock-choice" lang="en" onClick={() => answer(ci)}>
                        {c.text}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 6, marginTop: 'auto' }}>
                    <p className="feedback" role="status">
                      {situation.turns[turn].choices[answers[turn]].best ? '좋아요! ' : '다시 볼까요? '}
                      {situation.turns[turn].choices[answers[turn]].feedback}
                    </p>
                    <button type="button" className="mock-primary" onClick={nextTurn}>
                      {turn + 1 < situation.turns.length ? '다음 대화' : '연습 마치기'}
                    </button>
                  </div>
                )}
              </>
            )}

            {phase === 'done' && situation && (
              <>
                <h3 ref={headingRef} tabIndex={-1} style={{ fontSize: 14 }}>
                  연습 완료 🎉
                </h3>
                <p>오늘 연습한 표현</p>
                {situation.phrases.map((p) => (
                  <div className="phrase" key={p.en} lang="en">
                    <strong>{p.en}</strong>
                  </div>
                ))}
                <button type="button" className="mock-primary" onClick={reset}>
                  다른 상황 해보기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
