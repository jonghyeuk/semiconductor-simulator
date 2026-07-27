import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * FieldEnglishSimulator — 반도체 현장 실무영어 시뮬레이터 (서고 drop-in)
 * ---------------------------------------------------------------------------
 * 목적: 디자인 툴 사용법이 아니라, 가상 장비/디자인 시뮬레이션을 통해
 *       "현장 영어를 읽고 판단하는" 훈련. 매주 4단계 루프를 반복한다.
 *          가상 매뉴얼 읽기 → 시뮬레이션 조작 → 로그·오류 해석 → 영문 보고
 *
 * 서고(주제 자료실) 규격 v1 prop 계약 (자기완결/props-only):
 *   - hideTabBar   : 상단 탭바 숨김 (자료실에서 true 로 들어옴) — 이 컴포넌트는 항상 자기 UI만 그림
 *   - controlledTab: 상위(SimPane) 탭. 이 컴포넌트는 전부 'simulation'이므로 수신만 하고 무시
 *   - onTabChange  : 있으면 개념 변경 시 호출
 *   - initialTheme : 특정 개념으로 초기 진입 ('equipment'|'alarm'|'drc'|'lvs'|'report')
 *   - hideOtherTabs: 그 개념만 남기고 개념 선택 UI 숨김 (목차 개별항목 분리용)
 *
 * 스타일: 호스트 CSS(Tailwind 유무)에 의존하지 않도록 inline style + 스코프 <style>.
 *         어느 서고/과정에 붙어도 동일하게 렌더된다.
 */

/* =========================================================================
 * 0. 공용 토큰 / 헬퍼
 * ====================================================================== */

const THEMES = [
  { id: 'overview', en: 'Course Map', ko: '강의 개요', icon: '🗺️', loop: 'Overview' },
  { id: 'weekly', en: 'Weekly Lessons', ko: '주차 수업', icon: '📅', loop: 'Lesson' },
  { id: 'equipment', en: 'Equipment HMI', ko: '가상 장비 조작', icon: '🖥️', loop: 'Operate' },
  { id: 'alarm', en: 'Alarm & Log', ko: '알람·로그 해석', icon: '🚨', loop: 'Interpret' },
  { id: 'drc', en: 'Design Rule Check', ko: 'DRC 오류 해석', icon: '📐', loop: 'Judge' },
  { id: 'lvs', en: 'LVS Compare', ko: 'LVS 비교', icon: '🔗', loop: 'Judge' },
  { id: 'report', en: 'Field Report', ko: '영문 보고', icon: '📝', loop: 'Report' },
];
const THEME_IDS = THEMES.map((t) => t.id);

const C = {
  bg: '#0b1220',
  panel: '#0f1a2e',
  panel2: '#132139',
  line: '#1e2d47',
  line2: '#2a3d5f',
  text: '#cbd5e1',
  dim: '#7c8db0',
  cyan: '#22d3ee',
  emerald: '#34d399',
  amber: '#fbbf24',
  red: '#f87171',
  violet: '#a78bfa',
  blue: '#60a5fa',
  mono: "'SF Mono','Roboto Mono','DejaVu Sans Mono',ui-monospace,monospace",
  sans: "'Inter',system-ui,-apple-system,'Segoe UI',sans-serif",
};

// 현장 영어 용어 사전 (hover 스캐폴딩)
const GLOSSARY = {
  chamber: '챔버 — 공정이 일어나는 진공 반응 공간',
  pump: '펌프 — 챔버 내부를 진공으로 배기하는 장치',
  valve: '밸브 — 가스/진공 배관을 여닫는 부품',
  evacuate: '배기하다 — 챔버 압력을 낮추다 (= pump down)',
  purge: '퍼지 — 불활성 가스로 잔류 가스를 밀어내는 것',
  vent: '벤트 — 챔버를 대기압으로 되돌리는 것',
  interlock: '인터록 — 안전조건 미충족 시 운전을 강제 정지하는 보호기능',
  timeout: '타임아웃 — 정해진 시간 내 목표에 도달하지 못한 상태',
  'set point': '설정값 — 도달하려는 목표값',
  'actual value': '실측값 — 현재 측정된 값',
  'reflected power': '반사파 — 매칭 불량으로 되돌아오는 RF 전력 (높으면 이상)',
  matching: '매칭 — RF 전력을 플라즈마에 효율적으로 전달하도록 임피던스를 맞추는 것',
  ignition: '점화 — 플라즈마가 처음 발생하는 것',
  leakage: '누설 — 밀봉 불량으로 외부 공기가 새어드는 것',
  enclosure: '엔클로저 — 한 레이어가 다른 레이어를 감싸야 하는 최소 겹침',
  spacing: '간격 — 같은 레이어 두 패턴 사이의 최소 거리',
  overlap: '오버랩 — 두 레이어가 겹쳐야 하는 최소량',
  violation: '위반 — 디자인 규칙(DRC)을 만족하지 못한 상태',
  mismatch: '불일치 — 레이아웃과 회로도(schematic)가 다른 상태',
  netlist: '넷리스트 — 소자와 연결 관계를 나열한 회로 정보',
};

function Term({ children, k }) {
  const key = (k || (typeof children === 'string' ? children : '')).toLowerCase();
  const tip = GLOSSARY[key];
  if (!tip) return <span>{children}</span>;
  return (
    <span className="fes-term" tabIndex={0}>
      {children}
      <span className="fes-tip">{tip}</span>
    </span>
  );
}

const fmtTorr = (v) => {
  if (v >= 1) return v.toFixed(v >= 100 ? 0 : 1) + ' Torr';
  const exp = Math.floor(Math.log10(v));
  const man = v / Math.pow(10, exp);
  return `${man.toFixed(1)}e${exp} Torr`;
};

/* =========================================================================
 * 1. 개념 ①  Equipment HMI — 가상 Plasma Etcher 조작 화면
 * ====================================================================== */

const MENUS = ['Main', 'Recipe', 'Chamber', 'Vacuum', 'Gas', 'RF Power', 'Alarm', 'Log', 'Maintenance', 'Manual'];

function EquipmentHMI() {
  const [step, setStep] = useState('idle'); // idle→loaded→pumping→base→gas→plasma→process→done
  const [menu, setMenu] = useState('Main');
  const [pressure, setPressure] = useState(760);
  const [flow, setFlow] = useState(0);
  const [rfFwd, setRfFwd] = useState(0);
  const [rfRef, setRfRef] = useState(0);
  const [temp, setTemp] = useState(24);
  const [log, setLog] = useState([{ t: 'INFO', m: 'System initialized. Equipment is in IDLE state.' }]);
  const [fault, setFault] = useState(false); // 이상 주입: 고압 상태에서 점화 시 반사파 급증
  const [alarm, setAlarm] = useState(null);
  const target = useRef(760);
  const logEnd = useRef(null);

  const push = useCallback((t, m) => setLog((L) => [...L.slice(-40), { t, m }]), []);

  // 압력을 target 으로 로그공간에서 일정 속도로 이동 (~3초에 배기/벤트 완료)
  useEffect(() => {
    const id = setInterval(() => {
      setPressure((p) => {
        const tg = target.current;
        const lp = Math.log10(p), lt = Math.log10(tg);
        if (Math.abs(lp - lt) < 0.16) return tg;
        return Math.pow(10, lp + (lt > lp ? 0.34 : -0.34));
      });
    }, 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { logEnd.current?.scrollIntoView({ block: 'nearest' }); }, [log]);

  // 배기 완료 감지
  useEffect(() => {
    if (step === 'pumping' && pressure <= 5e-6 * 1.05) {
      setStep('base');
      push('INFO', 'Base pressure reached (5.0e-6 Torr). Chamber is ready.');
    }
  }, [pressure, step, push]);

  const reset = () => {
    target.current = 760;
    setStep('idle'); setPressure(760); setFlow(0); setRfFwd(0); setRfRef(0); setTemp(24);
    setAlarm(null); setMenu('Main');
    setLog([{ t: 'INFO', m: 'System reset. Equipment is in IDLE state.' }]);
  };

  const act = (a) => {
    if (a === 'load') { setStep('loaded'); push('INFO', 'Wafer loaded on the chuck. Ready to evacuate.'); }
    else if (a === 'pump') { target.current = 5e-6; setStep('pumping'); push('CMD', 'Pump down started. Evacuating chamber...'); }
    else if (a === 'vent') { target.current = 760; setStep('loaded'); setFlow(0); setRfFwd(0); setRfRef(0); push('CMD', 'Venting chamber to atmosphere...'); }
    else if (a === 'gas') { setFlow(50); setStep('gas'); push('INFO', 'Process gas (SF6) flowing. Set point 50 sccm.'); target.current = 8e-3; }
    else if (a === 'rf') {
      if (fault) {
        setRfFwd(600); setRfRef(420);
        setAlarm({ code: 'RF-204', m: 'High reflected power detected. Plasma failed to ignite.' });
        push('ALARM', 'RF-204 High reflected power (420 W). Matching failed. Process stopped by the interlock.');
        setStep('gas');
      } else {
        setRfFwd(600); setRfRef(15); setStep('plasma');
        push('INFO', 'Plasma ignited. Forward 600 W / Reflected 15 W. Matching OK.');
      }
    }
    else if (a === 'process') { setStep('process'); setTemp(65); push('CMD', 'Etch process started. Recipe ETCH-01 running (60 s).'); setTimeout(() => { setStep('done'); push('INFO', 'Process finished. Endpoint detected.'); }, 2600); }
    else if (a === 'stop') { setRfFwd(0); setRfRef(0); setFlow(0); setStep('base'); setAlarm(null); push('CMD', 'Operation stopped by operator.'); }
    else if (a === 'unload') { reset(); }
    else if (a === 'clearAlarm') { setAlarm(null); setRfFwd(0); setRfRef(0); push('CMD', 'Alarm acknowledged and cleared.'); }
  };

  // 각 메뉴 화면(영문)
  const screens = {
    Main: (
      <div>
        <div className="fes-scr-title">SYSTEM OVERVIEW</div>
        <div className="fes-grid2">
          <ReadRow label="Equipment" value="Plasma Etcher PE-3000" />
          <ReadRow label="State" value={step.toUpperCase()} tone={step === 'process' ? 'ok' : 'dim'} />
          <ReadRow label="Recipe" value="ETCH-01" />
          <ReadRow label="Wafer" value={step === 'idle' ? 'None' : 'Slot 1'} />
        </div>
        <p className="fes-hint">현장 팁: <Term k="chamber">Chamber</Term> 상태를 먼저 확인하고, 순서대로 조작하세요.</p>
      </div>
    ),
    Recipe: (
      <div>
        <div className="fes-scr-title">RECIPE — ETCH-01</div>
        <table className="fes-tbl"><tbody>
          <tr><td>Gas</td><td>SF6</td><td>50 sccm</td></tr>
          <tr><td>Pressure</td><td><Term k="set point">Set point</Term></td><td>8.0e-3 Torr</td></tr>
          <tr><td>RF Power</td><td>Forward</td><td>600 W</td></tr>
          <tr><td>Time</td><td>Etch</td><td>60 s</td></tr>
        </tbody></table>
      </div>
    ),
    Chamber: (
      <div>
        <div className="fes-scr-title">CHAMBER STATUS</div>
        <div className="fes-grid2">
          <ReadRow label="Pressure (actual)" value={fmtTorr(pressure)} tone={pressure < 1e-4 ? 'ok' : 'warn'} />
          <ReadRow label="Temperature" value={`${temp} °C`} />
          <ReadRow label="Lid" value="Closed" tone="ok" />
          <ReadRow label="Chuck" value={step === 'idle' ? 'Empty' : 'Wafer present'} />
        </div>
      </div>
    ),
    Vacuum: (
      <div>
        <div className="fes-scr-title">VACUUM SYSTEM</div>
        <div className="fes-grid2">
          <ReadRow label={<Term k="actual value">Actual value</Term>} value={fmtTorr(pressure)} tone={pressure < 1e-4 ? 'ok' : 'warn'} />
          <ReadRow label={<Term k="set point">Set point</Term>} value="5.0e-6 Torr" />
          <ReadRow label="Turbo pump" value={step === 'pumping' || pressure < 1 ? 'Running' : 'Standby'} />
          <ReadRow label="Gate valve" value={pressure < 1 ? 'Open' : 'Closed'} />
        </div>
        {pressure > 1 && step === 'pumping' && <p className="fes-hint">Pumping in progress — pressure is decreasing.</p>}
      </div>
    ),
    Gas: (
      <div>
        <div className="fes-scr-title">GAS DELIVERY (MFC)</div>
        <div className="fes-grid2">
          <ReadRow label="Gas line" value="SF6" />
          <ReadRow label="Flow (actual)" value={`${flow} sccm`} tone={flow > 0 ? 'ok' : 'dim'} />
          <ReadRow label="Flow (set point)" value="50 sccm" />
          <ReadRow label={<Term k="valve">Valve</Term>} value={flow > 0 ? 'Open' : 'Closed'} />
        </div>
      </div>
    ),
    'RF Power': (
      <div>
        <div className="fes-scr-title">RF GENERATOR</div>
        <div className="fes-grid2">
          <ReadRow label="Forward power" value={`${rfFwd} W`} tone={rfFwd > 0 ? 'ok' : 'dim'} />
          <ReadRow label={<Term k="reflected power">Reflected power</Term>} value={`${rfRef} W`} tone={rfRef > 50 ? 'bad' : 'ok'} />
          <ReadRow label={<Term k="matching">Matching</Term>} value={rfRef > 50 ? 'FAILED' : rfFwd ? 'OK' : '—'} tone={rfRef > 50 ? 'bad' : 'dim'} />
          <ReadRow label="Frequency" value="13.56 MHz" />
        </div>
        {rfRef > 50 && <p className="fes-hint" style={{ color: C.red }}>High reflected power → check pressure & matching before ignition.</p>}
      </div>
    ),
    Alarm: (
      <div>
        <div className="fes-scr-title">ALARM</div>
        {alarm ? (
          <div className="fes-alarm">
            <div className="fes-alarm-code">⚠ {alarm.code}</div>
            <div>{alarm.m}</div>
            <div className="fes-alarm-act">Action: Check the vacuum and matching, then acknowledge.</div>
          </div>
        ) : <div className="fes-ok">No active alarms.</div>}
      </div>
    ),
    Log: (
      <div>
        <div className="fes-scr-title">EVENT LOG</div>
        <div className="fes-log">
          {log.map((l, i) => (
            <div key={i} className="fes-logrow">
              <span className={`fes-tag fes-tag-${l.t.toLowerCase()}`}>{l.t}</span>
              <span>{l.m}</span>
            </div>
          ))}
          <div ref={logEnd} />
        </div>
      </div>
    ),
    Maintenance: (
      <div>
        <div className="fes-scr-title">PREVENTIVE MAINTENANCE</div>
        <table className="fes-tbl"><tbody>
          <tr><td>Inspect</td><td>O-ring seal</td><td>Weekly</td></tr>
          <tr><td>Clean</td><td>Chamber wall</td><td>Every 500 wafers</td></tr>
          <tr><td>Replace</td><td>Pump oil</td><td>6 months</td></tr>
          <tr><td>Calibrate</td><td>MFC / gauge</td><td>Yearly</td></tr>
        </tbody></table>
      </div>
    ),
    Manual: (
      <div>
        <div className="fes-scr-title">OPERATING PROCEDURE (Quick Manual)</div>
        <ol className="fes-ol">
          <li><b>Load</b> the wafer onto the chuck.</li>
          <li><b><Term k="evacuate">Evacuate</Term></b> the chamber (pump down) to base pressure.</li>
          <li>Start the process <b>gas</b> and stabilize the flow.</li>
          <li><b>Ignite</b> the plasma. Confirm matching (<Term k="reflected power">reflected power</Term> low).</li>
          <li>Run the <b>process</b>, then <b>stop</b> and <b><Term k="vent">vent</Term></b>.</li>
        </ol>
      </div>
    ),
  };

  // 현재 step 에서 가능한 조작
  const btns = [
    { a: 'load', l: 'Load Wafer', on: step === 'idle' },
    { a: 'pump', l: 'Pump Down', on: step === 'loaded' },
    { a: 'gas', l: 'Start Gas', on: step === 'base' },
    { a: 'rf', l: 'Ignite Plasma', on: step === 'gas' && flow > 0 },
    { a: 'process', l: 'Start Process', on: step === 'plasma' },
    { a: 'stop', l: 'Stop', on: ['gas', 'plasma', 'process'].includes(step), danger: true },
    { a: 'vent', l: 'Vent', on: ['base', 'done'].includes(step) },
    { a: 'unload', l: 'Reset', on: true, ghost: true },
  ];

  return (
    <div>
      <StepBar step={step} />
      <div className="fes-hmi">
        {/* 좌: 메뉴 */}
        <div className="fes-menu">
          {MENUS.map((m) => (
            <button key={m} onClick={() => setMenu(m)}
              className={`fes-menu-btn ${menu === m ? 'on' : ''} ${m === 'Alarm' && alarm ? 'alarm' : ''}`}>
              {m}{m === 'Alarm' && alarm ? ' ●' : ''}
            </button>
          ))}
        </div>
        {/* 중: 화면 */}
        <div className="fes-screen">{screens[menu]}</div>
        {/* 우: 게이지 */}
        <div className="fes-gauges">
          <Gauge label="PRESSURE" value={fmtTorr(pressure)} pct={Math.max(2, (Math.log10(pressure) + 6) / 8.9 * 100)} color={pressure < 1e-4 ? C.emerald : C.amber} />
          <Gauge label="GAS FLOW" value={`${flow} sccm`} pct={flow / 100 * 100} color={C.cyan} />
          <Gauge label="RF FWD" value={`${rfFwd} W`} pct={rfFwd / 800 * 100} color={C.violet} />
          <Gauge label="RF REFL" value={`${rfRef} W`} pct={rfRef / 500 * 100} color={rfRef > 50 ? C.red : C.dim} />
        </div>
      </div>

      {alarm && (
        <div className="fes-alarm-bar">
          <span>⚠ {alarm.code} — {alarm.m}</span>
          <button className="fes-btn danger" onClick={() => act('clearAlarm')}>Acknowledge</button>
        </div>
      )}

      <div className="fes-controls">
        <label className="fes-inject">
          <input type="checkbox" checked={fault} onChange={(e) => setFault(e.target.checked)} />
          Inject fault (ignite at high pressure)
        </label>
        <div className="fes-btnrow">
          {btns.map((b) => (
            <button key={b.a} disabled={!b.on} onClick={() => act(b.a)}
              className={`fes-btn ${b.danger ? 'danger' : ''} ${b.ghost ? 'ghost' : ''}`}>{b.l}</button>
          ))}
        </div>
      </div>

      <TaskCard title="STUDENT TASK — read & decide (English)">
        <ol className="fes-task-ol">
          <li>Read the English messages in the <b>Log</b> and <b>Alarm</b> menus.</li>
          <li>Identify which subsystem is abnormal (vacuum / gas / RF).</li>
          <li>Choose the likely cause, then take the corrective action.</li>
          <li>Move to the <b>Alarm &amp; Log</b> tab to answer the interpretation quiz.</li>
        </ol>
      </TaskCard>
    </div>
  );
}

function StepBar({ step }) {
  const order = ['idle', 'loaded', 'base', 'gas', 'plasma', 'process', 'done'];
  const label = { idle: 'Idle', loaded: 'Loaded', base: 'Vacuum', gas: 'Gas', plasma: 'Plasma', process: 'Process', done: 'Done' };
  const cur = Math.max(0, order.indexOf(step === 'pumping' ? 'loaded' : step));
  return (
    <div className="fes-stepbar">
      {order.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`fes-step ${i <= cur ? 'on' : ''} ${i === cur ? 'cur' : ''}`}>
            <span className="fes-step-dot">{i + 1}</span>{label[s]}
          </div>
          {i < order.length - 1 && <div className={`fes-step-line ${i < cur ? 'on' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Gauge({ label, value, pct, color }) {
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="fes-gauge">
      <div className="fes-gauge-top"><span>{label}</span><span style={{ color }}>{value}</span></div>
      <div className="fes-gauge-bar"><div style={{ width: `${p}%`, background: color }} /></div>
    </div>
  );
}

function ReadRow({ label, value, tone }) {
  const col = { ok: C.emerald, warn: C.amber, bad: C.red, dim: C.dim }[tone] || C.text;
  return (
    <div className="fes-readrow">
      <span className="fes-readrow-l">{label}</span>
      <span className="fes-readrow-v" style={{ color: col }}>{value}</span>
    </div>
  );
}

/* =========================================================================
 * 2. 개념 ②  Alarm & Log — 영문 알람 해석 (원인·조치 선택 채점)
 * ====================================================================== */

const ALARM_CASES = [
  {
    code: 'VAC-101',
    msg: 'Chamber pressure is above the allowable limit. Process operation has been stopped by the interlock.',
    log: ['12:04:11  Pump down started', '12:06:40  Pressure 2.1e-2 Torr  (timeout)', '12:06:41  VAC-101 raised — interlock'],
    q: {
      device: { prompt: 'Which subsystem is abnormal?', opts: ['Vacuum / pumping system', 'RF generator', 'Gas line (MFC)'], ans: 0 },
      cause: { prompt: 'Most likely cause?', opts: ['Reflected power too high', 'A vacuum valve is closed or there is a leak', 'Wrong recipe time'], ans: 1 },
      action: { prompt: 'Corrective action?', opts: ['Increase RF power', 'Check the vacuum valve and pumping system for leaks', 'Change the mask'], ans: 1 },
    },
  },
  {
    code: 'RF-204',
    msg: 'High reflected power detected. Plasma failed to ignite. Matching network could not tune.',
    log: ['09:15:02  Gas flow 50 sccm OK', '09:15:20  RF on: Fwd 600 W / Refl 420 W', '09:15:21  RF-204 raised'],
    q: {
      device: { prompt: 'Which subsystem is abnormal?', opts: ['Vacuum system', 'RF power / matching', 'Wafer handler'], ans: 1 },
      cause: { prompt: 'Most likely cause?', opts: ['Chamber pressure out of range or matching not tuned', 'Pump oil low', 'Door open'], ans: 0 },
      action: { prompt: 'Corrective action?', opts: ['Vent the chamber immediately', 'Check pressure/gas and re-tune the matching network', 'Replace the wafer'], ans: 1 },
    },
  },
  {
    code: 'GAS-330',
    msg: 'Gas flow does not reach the set point. Actual flow is far below the set point (timeout).',
    log: ['14:22:01  Set point 50 sccm', '14:22:31  Actual 6 sccm  (timeout)', '14:22:31  GAS-330 warning'],
    q: {
      device: { prompt: 'Which subsystem is abnormal?', opts: ['Gas delivery (MFC / valve)', 'RF generator', 'Vacuum gauge'], ans: 0 },
      cause: { prompt: 'Most likely cause?', opts: ['Plasma over-ignited', 'Gas cylinder empty or MFC/valve blocked', 'Recipe file missing'], ans: 1 },
      action: { prompt: 'Corrective action?', opts: ['Check the gas supply and calibrate/replace the MFC', 'Raise the RF power', 'Reboot the monitor'], ans: 0 },
    },
  },
];

function AlarmLab() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState({});
  const [checked, setChecked] = useState(false);
  const cse = ALARM_CASES[idx];
  const keys = ['device', 'cause', 'action'];
  const score = keys.filter((k) => sel[k] === cse.q[k].ans).length;

  const go = (n) => { setIdx(n); setSel({}); setChecked(false); };

  return (
    <div>
      <div className="fes-casebar">
        {ALARM_CASES.map((c, i) => (
          <button key={c.code} onClick={() => go(i)} className={`fes-chip ${i === idx ? 'on' : ''}`}>{c.code}</button>
        ))}
      </div>

      <div className="fes-alarm-panel">
        <div className="fes-alarm-head">🚨 ALARM MESSAGE — {cse.code}</div>
        <div className="fes-alarm-msg">{cse.msg}</div>
        <div className="fes-log fes-log-embed">
          {cse.log.map((l, i) => <div key={i} className="fes-logrow"><span className="fes-tag fes-tag-info">LOG</span><span>{l}</span></div>)}
        </div>
      </div>

      <div className="fes-qs">
        {keys.map((k) => {
          const q = cse.q[k];
          return (
            <div key={k} className="fes-q">
              <div className="fes-q-prompt">{q.prompt}</div>
              <div className="fes-q-opts">
                {q.opts.map((o, i) => {
                  const chosen = sel[k] === i;
                  const right = checked && i === q.ans;
                  const wrong = checked && chosen && i !== q.ans;
                  return (
                    <button key={i} disabled={checked}
                      onClick={() => setSel((s) => ({ ...s, [k]: i }))}
                      className={`fes-opt ${chosen ? 'sel' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''}`}>
                      {o}{right ? '  ✓' : wrong ? '  ✕' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fes-check-row">
        {!checked ? (
          <button className="fes-btn" disabled={keys.some((k) => sel[k] === undefined)} onClick={() => setChecked(true)}>Check answers</button>
        ) : (
          <>
            <span className={`fes-score ${score === 3 ? 'ok' : score >= 1 ? 'mid' : 'bad'}`}>Score {score}/3</span>
            <button className="fes-btn ghost" onClick={() => { setSel({}); setChecked(false); }}>Retry</button>
            {idx < ALARM_CASES.length - 1 && <button className="fes-btn" onClick={() => go(idx + 1)}>Next case →</button>}
          </>
        )}
      </div>

      <TaskCard title="STUDENT TASK">
        <p style={{ margin: 0 }}>영문 알람과 로그를 읽고 <b>① 이상 장치 ② 예상 원인 ③ 조치</b>를 고르세요. 3케이스 모두 3/3을 목표로.</p>
      </TaskCard>
    </div>
  );
}

/* =========================================================================
 * 3. 개념 ③  DRC — Layer 배치 + Width/Spacing 조절 → 영문 violation 로그
 * ====================================================================== */

const DRC_RULES = { minWidth: 0.30, minSpacing: 0.30 }; // μm

function DrcLab() {
  const [width, setWidth] = useState(0.20);   // 각 metal bar 폭 (μm)
  const [spacing, setSpacing] = useState(0.18); // 두 bar 사이 간격 (μm)
  const [ran, setRan] = useState(false);

  const violations = [];
  if (ran) {
    if (width < DRC_RULES.minWidth) violations.push({ rule: 'METAL1.WIDTH', req: DRC_RULES.minWidth, meas: width, msg: 'Minimum width violation' });
    if (spacing < DRC_RULES.minSpacing) violations.push({ rule: 'METAL1.SPACING', req: DRC_RULES.minSpacing, meas: spacing, msg: 'Insufficient spacing' });
  }
  const clean = ran && violations.length === 0;

  // SVG 좌표 (1μm = 260px 스케일)
  const S = 260, x0 = 60;
  const wpx = width * S, spx = spacing * S;
  const bar2x = x0 + wpx + spx;

  return (
    <div>
      <div className="fes-cad">
        <svg viewBox="0 0 640 240" className="fes-cad-svg">
          <defs>
            <pattern id="fesgrid" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0H0V26" fill="none" stroke="#16233b" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="640" height="240" fill="#0a0f1a" />
          <rect width="640" height="240" fill="url(#fesgrid)" />
          {/* Metal1 bars */}
          <rect x={x0} y={50} width={wpx} height={140} fill="#3b82f6" opacity="0.85" stroke="#93c5fd" />
          <rect x={bar2x} y={50} width={wpx} height={140} fill="#3b82f6" opacity="0.85" stroke="#93c5fd" />
          {/* spacing dimension */}
          <line x1={x0 + wpx} y1={120} x2={bar2x} y2={120} stroke={spacing < DRC_RULES.minSpacing && ran ? C.red : C.emerald} strokeWidth="2" markerEnd="url(#fa)" markerStart="url(#fa)" />
          <text x={(x0 + wpx + bar2x) / 2} y={112} fill={C.text} fontSize="13" textAnchor="middle" fontFamily={C.mono}>{spacing.toFixed(2)}µm</text>
          {/* width dimension */}
          <text x={x0 + wpx / 2} y={210} fill={C.dim} fontSize="12" textAnchor="middle" fontFamily={C.mono}>W {width.toFixed(2)}µm</text>
          <defs><marker id="fa" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 4L8 4M4 1L1 4L4 7" stroke={C.emerald} fill="none" /></marker></defs>
          {ran && violations.map((v, i) => (
            <rect key={i} x={v.rule.includes('SPACING') ? x0 + wpx : x0} y={44} width={v.rule.includes('SPACING') ? spx + 12 : wpx + 12} height={152} fill="none" stroke={C.red} strokeWidth="2.5" strokeDasharray="6 4" />
          ))}
          <text x={16} y={28} fill={C.dim} fontSize="12" fontFamily={C.mono}>LAYER: METAL1</text>
        </svg>
      </div>

      <div className="fes-sliders">
        <SliderRow label={<>Width <Term k="spacing">(bar)</Term></>} value={width} set={(v) => { setWidth(v); setRan(false); }} min={0.10} max={0.50} req={DRC_RULES.minWidth} />
        <SliderRow label={<><Term k="spacing">Spacing</Term> (gap)</>} value={spacing} set={(v) => { setSpacing(v); setRan(false); }} min={0.10} max={0.50} req={DRC_RULES.minSpacing} />
        <button className="fes-btn" onClick={() => setRan(true)}>▶ Run DRC</button>
      </div>

      <div className="fes-drc-out">
        <div className="fes-scr-title">DRC REPORT</div>
        {!ran && <div className="fes-dim">Adjust the layout, then run DRC.</div>}
        {clean && <div className="fes-ok">✓ DRC clean. 0 violations. Layout meets all design rules.</div>}
        {ran && violations.map((v, i) => (
          <div key={i} className="fes-viol">
            <div className="fes-viol-head">✕ {v.rule} <Term k="violation">violation</Term></div>
            <div className="fes-viol-body">
              {v.msg}. Required: {v.req.toFixed(2)} µm — Measured: {v.meas.toFixed(2)} µm.
            </div>
          </div>
        ))}
      </div>

      <TaskCard title="STUDENT TASK — interpret & fix">
        <p style={{ margin: '0 0 6px' }}>DRC 로그를 영어로 읽고, 무엇이 위반됐는지 한국어로 한 문장 요약한 뒤 규칙을 만족하도록 슬라이더를 고치세요.</p>
        <p style={{ margin: 0, color: C.dim, fontFamily: C.mono, fontSize: 12 }}>
          예: "Metal 1 사이의 실제 간격이 {spacing.toFixed(2)}µm로, 최소 요구 간격 {DRC_RULES.minSpacing.toFixed(2)}µm보다 작다 → 간격을 넓혀야 한다."
        </p>
      </TaskCard>
    </div>
  );
}

function SliderRow({ label, value, set, min, max, req }) {
  const bad = value < req;
  return (
    <div className="fes-slider">
      <div className="fes-slider-top">
        <span>{label}</span>
        <span style={{ color: bad ? C.amber : C.emerald, fontFamily: C.mono }}>{value.toFixed(2)} µm</span>
      </div>
      <input type="range" min={min} max={max} step={0.01} value={value} onChange={(e) => set(parseFloat(e.target.value))} className="fes-range" />
      <div className="fes-slider-req">min {req.toFixed(2)} µm</div>
    </div>
  );
}

/* =========================================================================
 * 4. 개념 ④  LVS — Schematic vs Layout 비교 (영문 mismatch 해석)
 * ====================================================================== */

const LVS_CASES = [
  {
    name: 'CMOS Inverter',
    report: ['LVS: comparing layout vs schematic...', 'Device count  schematic=2  layout=1', 'ERROR: Missing device — NMOS (MN) not found in layout'],
    prompt: 'What does the LVS report say?',
    opts: ['Layout has an extra device', 'The NMOS transistor is missing in the layout', 'The power net is shorted'],
    ans: 1,
    fix: 'Place the missing NMOS device in the layout, then re-run LVS.',
  },
  {
    name: 'CMOS Inverter',
    report: ['LVS: comparing nets...', 'Net OUT: schematic connects MP.drain & MN.drain', 'ERROR: Incorrect connection — MN.drain tied to VSS instead of OUT'],
    prompt: 'What does the LVS report say?',
    opts: ['A transistor is duplicated', 'NMOS drain is wired to the wrong net (VSS, not OUT)', 'Layer color is wrong'],
    ans: 1,
    fix: 'Reconnect the NMOS drain to the OUT net, then re-run LVS.',
  },
];

function LvsLab() {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [checked, setChecked] = useState(false);
  const cse = LVS_CASES[idx];
  const missing = idx === 0;
  const miswire = idx === 1;

  const go = (n) => { setIdx(n); setSel(null); setChecked(false); };

  return (
    <div>
      <div className="fes-casebar">
        {LVS_CASES.map((c, i) => <button key={i} onClick={() => go(i)} className={`fes-chip ${i === idx ? 'on' : ''}`}>Case {i + 1}</button>)}
      </div>

      <div className="fes-lvs">
        {/* Schematic */}
        <div className="fes-lvs-col">
          <div className="fes-lvs-title">SCHEMATIC (golden)</div>
          <svg viewBox="0 0 220 220" className="fes-lvs-svg">
            <InverterSVG missing={false} miswire={false} />
          </svg>
        </div>
        <div className="fes-lvs-vs">≠</div>
        {/* Layout */}
        <div className="fes-lvs-col">
          <div className="fes-lvs-title">LAYOUT (extracted)</div>
          <svg viewBox="0 0 220 220" className="fes-lvs-svg">
            <InverterSVG missing={missing} miswire={miswire} />
          </svg>
        </div>
      </div>

      <div className="fes-drc-out">
        <div className="fes-scr-title">LVS REPORT</div>
        {cse.report.map((r, i) => (
          <div key={i} className={`fes-logrow ${r.startsWith('ERROR') ? 'err' : ''}`}>
            <span className={`fes-tag ${r.startsWith('ERROR') ? 'fes-tag-alarm' : 'fes-tag-info'}`}>{r.startsWith('ERROR') ? 'ERR' : 'LVS'}</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      <div className="fes-q" style={{ marginTop: 12 }}>
        <div className="fes-q-prompt">{cse.prompt}</div>
        <div className="fes-q-opts">
          {cse.opts.map((o, i) => {
            const chosen = sel === i, right = checked && i === cse.ans, wrong = checked && chosen && i !== cse.ans;
            return <button key={i} disabled={checked} onClick={() => setSel(i)} className={`fes-opt ${chosen ? 'sel' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''}`}>{o}{right ? '  ✓' : wrong ? '  ✕' : ''}</button>;
          })}
        </div>
      </div>

      <div className="fes-check-row">
        {!checked ? <button className="fes-btn" disabled={sel === null} onClick={() => setChecked(true)}>Check</button>
          : <>
            <span className={`fes-score ${sel === cse.ans ? 'ok' : 'bad'}`}>{sel === cse.ans ? 'Correct' : 'Try again'}</span>
            {sel === cse.ans && <span className="fes-fix">Fix: {cse.fix}</span>}
            <button className="fes-btn ghost" onClick={() => { setSel(null); setChecked(false); }}>Reset</button>
          </>}
      </div>

      <TaskCard title="STUDENT TASK">
        <p style={{ margin: 0 }}><Term k="netlist">Netlist</Term> 비교 결과의 영문 <Term k="mismatch">mismatch</Term> 메시지를 읽고, 무엇이 다른지(missing device / incorrect connection) 판단하세요.</p>
      </TaskCard>
    </div>
  );
}

function InverterSVG({ missing, miswire }) {
  return (
    <g fontFamily={C.mono} fontSize="11" fill={C.text}>
      <line x1="110" y1="12" x2="110" y2="40" stroke={C.dim} />
      <text x="114" y="20" fill={C.dim}>VDD</text>
      {/* PMOS */}
      <rect x="86" y="40" width="48" height="34" fill="none" stroke={C.violet} strokeWidth="2" rx="3" />
      <text x="96" y="61" fill={C.violet}>MP</text>
      {/* NMOS */}
      {!missing ? (
        <>
          <rect x="86" y="120" width="48" height="34" fill="none" stroke={C.emerald} strokeWidth="2" rx="3" />
          <text x="96" y="141" fill={C.emerald}>MN</text>
          <line x1="110" y1="74" x2="110" y2="120" stroke={miswire ? C.red : C.dim} strokeDasharray={miswire ? '4 3' : ''} />
          {/* OUT tap */}
          <line x1="110" y1="97" x2="170" y2="97" stroke={miswire ? C.red : C.cyan} />
          <text x="174" y="101" fill={miswire ? C.red : C.cyan}>OUT</text>
          {/* NMOS source to VSS (miswire: drain->VSS) */}
          <line x1="110" y1="154" x2="110" y2="185" stroke={C.dim} />
          {miswire && <line x1="110" y1="120" x2="150" y2="120" stroke={C.red} strokeWidth="2" />}
          {miswire && <text x="150" y="118" fill={C.red}>→VSS?</text>}
        </>
      ) : (
        <>
          <rect x="86" y="120" width="48" height="34" fill="none" stroke={C.red} strokeWidth="2" strokeDasharray="5 4" rx="3" />
          <text x="92" y="141" fill={C.red} fontSize="10">MISSING</text>
          <line x1="110" y1="74" x2="110" y2="97" stroke={C.dim} />
          <line x1="110" y1="97" x2="170" y2="97" stroke={C.cyan} />
          <text x="174" y="101" fill={C.cyan}>OUT</text>
        </>
      )}
      <line x1="110" y1="185" x2="110" y2="205" stroke={C.dim} />
      <text x="114" y="200" fill={C.dim}>VSS</text>
    </g>
  );
}

/* =========================================================================
 * 5. 개념 ⑤  Field Report — 영문 보고서 작성 (루브릭)
 * ====================================================================== */

const REPORT_SCENARIO = {
  title: 'Scenario — Etch result abnormal',
  brief: 'During ETCH-01, pressure and RF power drifted out of range. The etched pattern width came out too narrow, and DRC then reported a METAL1.WIDTH violation. Write a short field report in English.',
  fields: [
    { k: 'Problem', hint: 'What went wrong? (one sentence)', model: 'The etched line width was smaller than the target, causing a DRC width violation.' },
    { k: 'Observed log', hint: 'Copy the key English log/alarm', model: 'RF reflected power high; chamber pressure above set point; METAL1.WIDTH violation (req 0.30 / meas 0.22 µm).' },
    { k: 'Possible cause', hint: 'Why did it happen?', model: 'Unstable pressure and poor RF matching changed the etch rate, so the line was over-etched.' },
    { k: 'Corrective action', hint: 'What did you do?', model: 'Re-stabilized the pressure, re-tuned the matching network, and re-ran the recipe with the correct width.' },
    { k: 'Result', hint: 'Final outcome', model: 'Line width returned to target; DRC came back clean (0 violations).' },
  ],
};

function ReportLab() {
  const [vals, setVals] = useState({});
  const [reveal, setReveal] = useState(false);
  const filled = REPORT_SCENARIO.fields.filter((f) => (vals[f.k] || '').trim().length >= 6).length;

  return (
    <div>
      <div className="fes-scn">
        <div className="fes-scr-title">{REPORT_SCENARIO.title}</div>
        <p style={{ margin: '6px 0 0', lineHeight: 1.6 }}>{REPORT_SCENARIO.brief}</p>
      </div>

      <div className="fes-report">
        {REPORT_SCENARIO.fields.map((f) => (
          <div key={f.k} className="fes-report-field">
            <label className="fes-report-label">{f.k}:</label>
            <textarea className="fes-ta" rows={2} placeholder={f.hint}
              value={vals[f.k] || ''} onChange={(e) => setVals((v) => ({ ...v, [f.k]: e.target.value }))} />
            {reveal && <div className="fes-model"><b>Model:</b> {f.model}</div>}
          </div>
        ))}
      </div>

      <div className="fes-check-row">
        <div className="fes-rubric">
          <span>Rubric</span>
          <div className="fes-rubric-bar"><div style={{ width: `${filled / 5 * 100}%` }} /></div>
          <span className="fes-mono">{filled}/5 sections</span>
        </div>
        <button className="fes-btn ghost" onClick={() => setReveal((r) => !r)}>{reveal ? 'Hide' : 'Show'} model answer</button>
      </div>

      <TaskCard title="STUDENT TASK — write in English">
        <p style={{ margin: 0 }}>5개 항목(Problem / Observed log / Possible cause / Corrective action / Result)을 <b>영어로</b> 작성한 뒤, 모범답안과 비교해 스스로 점검하세요.</p>
      </TaskCard>
    </div>
  );
}

/* =========================================================================
 * 공용 TaskCard
 * ====================================================================== */
function TaskCard({ title, children }) {
  return (
    <div className="fes-taskcard">
      <div className="fes-taskcard-h">{title}</div>
      <div className="fes-taskcard-b">{children}</div>
    </div>
  );
}

/* =========================================================================
 * 주차 수업 (Weekly Lessons) — 주차별 전용 인터랙티브 수업
 * ====================================================================== */

const WEEKS = [
  { n: 1, t: '개요 · 기본 용어', on: true },
  { n: 2, t: '장비 구성요소', on: true },
  { n: 3, t: '운전 절차', on: false },
  { n: 4, t: '진공 · 가스 로그', on: false },
  { n: 5, t: '플라즈마', on: false },
  { n: 6, t: '알람 · 조치', on: false },
  { n: 7, t: '유지보수(PM)', on: false },
  { n: 8, t: '중간고사', on: false },
  { n: 9, t: 'Layer 용어', on: false },
  { n: 10, t: 'Design Rule', on: false },
  { n: 11, t: '패턴 배치', on: false },
  { n: 12, t: 'DRC 오류', on: false },
  { n: 13, t: 'LVS', on: false },
  { n: 14, t: '종합 프로젝트', on: false },
  { n: 15, t: '기말고사', on: false },
];

// 재사용 객관식 퀴즈 블록
function QuizBlock({ intro, questions }) {
  const [sel, setSel] = useState({});
  const [checked, setChecked] = useState(false);
  const score = questions.filter((q, i) => sel[i] === q.ans).length;
  return (
    <div>
      {intro && <p className="fes-wk-quiz-intro">{intro}</p>}
      <div className="fes-qs">
        {questions.map((q, i) => (
          <div key={i} className="fes-q">
            <div className="fes-q-prompt"><span className="fes-wk-qn">Q{i + 1}</span> {q.prompt}</div>
            <div className="fes-q-opts">
              {q.opts.map((o, j) => {
                const chosen = sel[i] === j, right = checked && j === q.ans, wrong = checked && chosen && j !== q.ans;
                return (
                  <button key={j} disabled={checked} onClick={() => setSel((s) => ({ ...s, [i]: j }))}
                    className={`fes-opt ${chosen ? 'sel' : ''} ${right ? 'right' : ''} ${wrong ? 'wrong' : ''}`}>
                    {o}{right ? '  ✓' : wrong ? '  ✕' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="fes-check-row">
        {!checked
          ? <button className="fes-btn" disabled={Object.keys(sel).length < questions.length} onClick={() => setChecked(true)}>Check answers</button>
          : <>
            <span className={`fes-score ${score === questions.length ? 'ok' : score >= 1 ? 'mid' : 'bad'}`}>Score {score}/{questions.length}</span>
            <button className="fes-btn ghost" onClick={() => { setSel({}); setChecked(false); }}>Retry</button>
          </>}
      </div>
    </div>
  );
}

/* ---- 1주차: 개요 · 직무 · 사용법 · 기본 용어 ---- */
const W1_ROLES = [
  { icon: '🛠️', role: 'Equipment Engineer', duty: 'Operates and maintains process equipment; reads English alarms and manuals.', ko: '장비 엔지니어 — 장비 운전·정비, 영문 알람·매뉴얼 해석' },
  { icon: '🧪', role: 'Process Engineer', duty: 'Sets recipes and analyzes process logs and English data sheets.', ko: '공정 엔지니어 — 레시피 설정, 영문 로그·데이터 분석' },
  { icon: '📐', role: 'Design Engineer', duty: 'Draws layouts and fixes DRC / LVS errors written in English.', ko: '설계 엔지니어 — 레이아웃 작성, 영문 DRC/LVS 오류 수정' },
];
const W1_GLOSSARY = [
  { en: 'Wafer', ko: '웨이퍼', d: '반도체를 만드는 얇은 원판(기판).' },
  { en: 'Chamber', ko: '챔버', d: '공정이 일어나는 진공 공간.' },
  { en: 'Vacuum', ko: '진공', d: '공기를 빼내 압력을 낮춘 상태.' },
  { en: 'Recipe', ko: '레시피', d: '가스·압력·시간 등 공정 조건표.' },
  { en: 'Etch', ko: '식각', d: '표면을 깎아내는 공정.' },
  { en: 'Deposition', ko: '증착', d: '표면에 얇은 막을 쌓는 공정.' },
];
const W1_TERMS = [
  { prompt: '“Wafer” 의 뜻은?', opts: ['웨이퍼 (반도체 기판)', '진공', '식각'], ans: 0 },
  { prompt: '“Chamber” 의 뜻은?', opts: ['레시피', '챔버 (공정이 일어나는 공간)', '밸브'], ans: 1 },
  { prompt: '“Vacuum” 의 뜻은?', opts: ['진공', '증착', '층(layer)'], ans: 0 },
  { prompt: '“Recipe” 의 뜻은?', opts: ['식각', '공정 조건표 (레시피)', '펌프'], ans: 1 },
  { prompt: '“Etch” 의 뜻은?', opts: ['쌓다 (증착)', '깎아내다 (식각)', '읽다'], ans: 1 },
  { prompt: '“Deposition” 의 뜻은?', opts: ['증착 (막을 쌓기)', '진공', '알람'], ans: 0 },
];

function Week1Lesson() {
  const steps = [
    {
      title: '현장 스토리 — 팹(fab) 첫 출근날',
      body: (
        <div>
          <div className="fes-wk-story">
            <div className="fes-wk-story-ic">🏭</div>
            <div>당신은 반도체 <b>팹(fab)</b>에 첫 출근했습니다. 장비 화면, 매뉴얼, 경고창이 <b>전부 영어</b>입니다.
            <br/>“<i>Chamber pressure is above the allowable limit…</i>” — 이게 무슨 뜻일까요?</div>
          </div>
          <p className="fes-wk-p">이 수업의 목표는 그 영어를 <b>읽고 → 판단하고 → 보고</b>하는 힘을 기르는 것입니다. 오늘은 첫날이니, 이 수업이 어떻게 흘러가는지와 가장 기본이 되는 용어부터 익혀봅시다.</p>
        </div>
      ),
    },
    {
      title: '이 수업이 뭘 하는 곳인가',
      body: <p className="fes-wk-p">반도체 현장에서 마주치는 <b>영어 화면·문서·오류</b>를 읽고 <b>판단</b>하는 연습을 합니다. 문법 시험이 아니라, 실제 장비 화면을 다루듯 영어를 씁니다.</p>,
    },
    {
      title: '현장 직무 이해 — 누가 영어를 쓰나',
      body: (
        <div className="fes-wk-roles">
          {W1_ROLES.map((r) => (
            <div key={r.role} className="fes-wk-role">
              <div className="fes-wk-role-h"><span>{r.icon}</span><b>{r.role}</b></div>
              <div className="fes-wk-role-en">{r.duty}</div>
              <div className="fes-wk-role-ko">{r.ko}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '시뮬레이터 사용법 — 매주 이 순서',
      body: (
        <div>
          <div className="fes-cm-loop" style={{ margin: '4px 0 0' }}>
            {['Read manual', 'Operate', 'Interpret log/error', 'Report'].map((s, i) => (
              <React.Fragment key={s}>
                <div className="fes-cm-loop-chip"><span>{i + 1}</span>{s}</div>
                {i < 3 && <span className="fes-cm-loop-ar">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="fes-wk-hint">상단 탭에서 도구를 열고, 화면의 영어를 읽고, 판단해서 답하면 됩니다. 모르는 단어는 <b>점선 밑줄에 마우스를 올리면</b> 뜻이 떠요.</p>
        </div>
      ),
    },
    {
      title: '기본 용어 — 먼저 읽어봅시다 (자료)',
      body: (
        <div>
          <p className="fes-wk-quiz-intro">현장에서 매일 쓰는 6개 기본 용어입니다. 소리내어 읽고 뜻을 익힌 뒤 다음 슬라이드에서 확인해요.</p>
          <div className="fes-wk-gloss">
            {W1_GLOSSARY.map((g) => (
              <div key={g.en} className="fes-wk-gloss-item">
                <div className="fes-wk-gloss-en">{g.en}</div>
                <div className="fes-wk-gloss-ko">{g.ko}</div>
                <div className="fes-wk-gloss-d">{g.d}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '기본 용어 워밍업 (퀴즈)',
      body: <QuizBlock intro="영어 용어를 보고 뜻을 고르세요. 6문제 모두 맞히면 통과." questions={W1_TERMS} />,
    },
  ];
  return <LessonDeck steps={steps} />;
}

/* ---- 2주차: 장비 구성요소 (클릭 구성도 + 매뉴얼 + 명명 퀴즈) ---- */
const W2_PARTS = [
  { id: 'chamber', en: 'Chamber', ko: '챔버', desc: 'The vacuum space where the process happens.', x: 130, y: 60, w: 200, h: 150 },
  { id: 'chuck', en: 'Wafer chuck', ko: '척 (웨이퍼 받침)', desc: 'Holds the wafer during the process.', x: 190, y: 170, w: 80, h: 18 },
  { id: 'gas', en: 'Gas line (MFC)', ko: '가스 라인 / 질량유량제어기', desc: 'Delivers and controls the process gas flow.', x: 198, y: 12, w: 64, h: 26 },
  { id: 'rf', en: 'RF generator', ko: 'RF 전원', desc: 'Supplies RF power to generate plasma.', x: 16, y: 150, w: 88, h: 34 },
  { id: 'valve', en: 'Gate valve', ko: '게이트 밸브', desc: 'Opens or closes the path to the pump.', x: 204, y: 214, w: 52, h: 16 },
  { id: 'pump', en: 'Turbo pump', ko: '터보 펌프', desc: 'Evacuates the chamber down to vacuum.', x: 190, y: 234, w: 80, h: 26 },
];
const W2_QUIZ = [
  { prompt: '“The vacuum space where the process happens.”', opts: ['Chamber', 'Pump', 'Recipe'], ans: 0 },
  { prompt: '“Delivers and controls the process gas flow.”', opts: ['RF generator', 'Gas line (MFC)', 'Wafer chuck'], ans: 1 },
  { prompt: '“Supplies RF power to generate plasma.”', opts: ['RF generator', 'Gate valve', 'Turbo pump'], ans: 0 },
  { prompt: '“Evacuates the chamber down to vacuum.”', opts: ['Wafer chuck', 'Turbo pump', 'Gas line'], ans: 1 },
  { prompt: '“Holds the wafer during the process.”', opts: ['Wafer chuck', 'Gate valve', 'Chamber'], ans: 0 },
];

function PartDiagram() {
  const [sel, setSel] = useState('chamber');
  const cur = W2_PARTS.find((p) => p.id === sel);
  return (
    <div className="fes-wk-diag">
      <svg viewBox="0 0 460 272" className="fes-wk-svg">
        <rect width="460" height="272" fill="#0a0f1a" />
        <line x1="230" y1="38" x2="230" y2="60" stroke="#3a4d6a" strokeWidth="4" />
        <line x1="104" y1="167" x2="190" y2="179" stroke="#3a4d6a" strokeWidth="4" />
        <line x1="230" y1="210" x2="230" y2="214" stroke="#3a4d6a" strokeWidth="6" />
        <line x1="230" y1="230" x2="230" y2="234" stroke="#3a4d6a" strokeWidth="6" />
        <ellipse cx="230" cy="140" rx="70" ry="46" fill="#a78bfa" opacity="0.18" />
        {W2_PARTS.map((p) => {
          const on = sel === p.id;
          return (
            <g key={p.id} onClick={() => setSel(p.id)} style={{ cursor: 'pointer' }}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="6"
                fill={p.id === 'chamber' ? 'none' : on ? `${C.cyan}22` : '#0f1d33'}
                stroke={on ? C.cyan : '#2a3d5f'} strokeWidth={on ? 3 : 1.5} />
              <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 4} textAnchor="middle" fontSize="12"
                fontFamily={C.mono} fill={on ? C.cyan : C.dim}>{p.en}</text>
            </g>
          );
        })}
      </svg>
      <div className="fes-wk-partinfo">
        <div className="fes-wk-partinfo-en">{cur.en} <span className="fes-wk-partinfo-ko">{cur.ko}</span></div>
        <div className="fes-wk-partinfo-desc">{cur.desc}</div>
        <div className="fes-wk-partinfo-hint">👆 도형을 클릭하면 부품별 영어 이름·설명이 바뀝니다.</div>
      </div>
    </div>
  );
}

function Week2Lesson() {
  const steps = [
    {
      title: '현장 스토리 — 장비 앞에 서다',
      body: (
        <div>
          <div className="fes-wk-story">
            <div className="fes-wk-story-ic">🏭</div>
            <div>식각 장비(Plasma Etcher) 앞. 선배가 말합니다:
            <br/>“<i>Check the chamber pressure and the MFC before you start.</i>”
            <br/><b>chamber? MFC?</b> — 부품 이름을 영어로 알아야 지시를 알아듣고 움직일 수 있습니다.</div>
          </div>
          <p className="fes-wk-p">오늘은 장비의 <b>주요 구성요소를 영어로</b> 익힙니다. 구성도를 직접 눌러보고, 매뉴얼을 읽고, 마지막에 이름을 맞혀봅시다.</p>
        </div>
      ),
    },
    {
      title: '가상 장비 구성도 — 부품을 눌러보세요',
      body: <PartDiagram />,
    },
    {
      title: '구성요소 정리 (자료)',
      body: (
        <div>
          <p className="fes-wk-quiz-intro">6개 핵심 부품의 영어 이름·뜻·기능입니다.</p>
          <table className="fes-wk-table">
            <thead><tr><th>English</th><th>한글</th><th>기능 (function)</th></tr></thead>
            <tbody>
              {W2_PARTS.map((p) => (
                <tr key={p.id}><td className="fes-wk-td-en">{p.en}</td><td>{p.ko}</td><td>{p.desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: '영문 매뉴얼 발췌 — Main Components',
      body: (
        <div className="fes-wk-manual">
          <div className="fes-wk-manual-h">MANUAL · 2. Main Components</div>
          <p>The <b>chamber</b> is the vacuum space where etching takes place. Process gas is supplied through the <b>gas line</b> and controlled by the <b>MFC</b>. The <b>RF generator</b> supplies power to the <b>wafer chuck</b> to ignite the plasma. The <b>turbo pump</b>, isolated by the <b>gate valve</b>, evacuates the chamber to base pressure.</p>
        </div>
      ),
    },
    {
      title: '구성요소 명명 퀴즈',
      body: <QuizBlock intro="영어 설명을 읽고 어느 부품인지 고르세요." questions={W2_QUIZ} />,
    },
  ];
  return <LessonDeck steps={steps} />;
}

// PPT처럼 한 화면씩 넘기는 슬라이드 뷰어 — 강의자는 '다음'만 누르면 순서대로 진행
function LessonDeck({ steps }) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;
  return (
    <div className="fes-ld">
      <div className="fes-ld-dots">
        {steps.map((s, j) => (
          <button key={j} onClick={() => setI(j)}
            className={`fes-ld-dot ${j === i ? 'on' : ''} ${j < i ? 'done' : ''}`} title={s.title} />
        ))}
      </div>
      <div className="fes-ld-slide">
        <div className="fes-ld-title"><span className="fes-ld-step">STEP {i + 1} / {steps.length}</span>{step.title}</div>
        <div className="fes-ld-body">{step.body}</div>
      </div>
      <div className="fes-ld-nav">
        <button className="fes-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>◀ 이전</button>
        <span className="fes-ld-count">{i + 1} / {steps.length}</span>
        <button className="fes-btn" disabled={last} onClick={() => setI(i + 1)}>{last ? '이 주차 끝 ✓' : '다음 ▶'}</button>
      </div>
    </div>
  );
}

function WeeklyLessons({ onOpen }) {
  const [wk, setWk] = useState(1);
  const meta = WEEKS.find((w) => w.n === wk);
  return (
    <div>
      <div className="fes-wk-rail">
        {WEEKS.map((w) => (
          <button key={w.n} disabled={!w.on} onClick={() => w.on && setWk(w.n)}
            className={`fes-wk-chip ${wk === w.n ? 'on' : ''} ${!w.on ? 'off' : ''}`} title={w.t}>
            W{w.n}{!w.on ? ' 🔒' : ''}
          </button>
        ))}
      </div>
      <div className="fes-wk-head">
        <div className="fes-wk-head-t"><b>{wk}주차</b> · {meta.t}</div>
        {!meta.on && <span className="fes-wk-soon">준비 중</span>}
      </div>

      {wk === 1 && <Week1Lesson />}
      {wk === 2 && <Week2Lesson />}
      {!meta.on && (
        <div className="fes-wk-placeholder">
          이 주차는 아직 준비 중입니다. 현재 <b>1주차(개요·기본 용어)</b>와 <b>2주차(장비 구성요소)</b>가 완성되어 있어요.
          <div className="fes-wk-ph-btns">
            <button className="fes-btn ghost" onClick={() => setWk(1)}>1주차 열기</button>
            <button className="fes-btn ghost" onClick={() => setWk(2)}>2주차 열기</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
 * 개념 ⓪  Course Map — 강의자용 한눈에 보기 콘솔 (주차 대신 구조 중심)
 * ====================================================================== */

const LANE_A = [
  { theme: 'equipment', icon: '🖥️', en: 'Equipment HMI', ko: '가상 장비 조작 · 영문 매뉴얼', wk: 'W2–5', terms: ['chamber', 'evacuate', 'interlock', 'set point'], tip: '메뉴별 영문 상태를 읽고 순서대로 운전' },
  { theme: 'alarm', icon: '🚨', en: 'Alarm & Log', ko: '영문 알람·로그 → 원인·조치', wk: 'W6–7', terms: ['alarm', 'timeout', 'reflected power'], tip: '이상 장치·원인·조치 3/3 목표' },
];
const LANE_B = [
  { theme: 'drc', icon: '📐', en: 'Design Rule Check', ko: 'Layer 배치 → DRC 오류 해석', wk: 'W9–12', terms: ['width', 'spacing', 'enclosure', 'violation'], tip: 'violation 문장 → 한 문장 요약 후 수정' },
  { theme: 'lvs', icon: '🔗', en: 'LVS Compare', ko: '레이아웃 vs 회로도 비교', wk: 'W13', terms: ['mismatch', 'missing device', 'net'], tip: 'missing vs incorrect connection 구분' },
];

function NodeCard({ n, onOpen }) {
  return (
    <button className="fes-cm-node" onClick={() => onOpen(n.theme)}>
      <div className="fes-cm-node-top">
        <span className="fes-cm-ic">{n.icon}</span>
        <div className="fes-cm-node-name"><b>{n.en}</b><span>{n.ko}</span></div>
        <span className="fes-cm-wk">{n.wk}</span>
      </div>
      <div className="fes-cm-terms">{n.terms.map((t) => <span key={t} className="fes-cm-term">{t}</span>)}</div>
      <div className="fes-cm-tip">👤 {n.tip}</div>
      <div className="fes-cm-open">실습 열기 →</div>
    </button>
  );
}

function CourseMap({ onOpen }) {
  return (
    <div className="fes-cm">
      {/* 4단계 루프 */}
      <div className="fes-cm-loop">
        {['Read manual', 'Operate', 'Interpret log/error', 'Report'].map((s, i) => (
          <React.Fragment key={s}>
            <div className="fes-cm-loop-chip"><span>{i + 1}</span>{s}</div>
            {i < 3 && <span className="fes-cm-loop-ar">→</span>}
          </React.Fragment>
        ))}
        <span className="fes-cm-loop-tag">매주 반복</span>
      </div>

      {/* 비중 막대 */}
      <div className="fes-cm-emph">
        <div className="fes-cm-emph-a">장비·공정 영어 (중심축) · 운전/로그/알람/PM</div>
        <div className="fes-cm-emph-b">디자인 영어 (결과 확인) · DRC/LVS</div>
      </div>

      {/* 두 축 */}
      <div className="fes-cm-lanes">
        <div className="fes-cm-lane">
          <div className="fes-cm-lane-h fes-a">① 장비·공정 축 — Operate &amp; Interpret</div>
          {LANE_A.map((n) => <NodeCard key={n.theme} n={n} onOpen={onOpen} />)}
        </div>
        <div className="fes-cm-lane">
          <div className="fes-cm-lane-h fes-b">② 디자인 축 — Read &amp; Judge</div>
          {LANE_B.map((n) => <NodeCard key={n.theme} n={n} onOpen={onOpen} />)}
        </div>
      </div>

      {/* 종합 → 보고 */}
      <div className="fes-cm-integr">
        <div className="fes-cm-integr-l">
          <div className="fes-cm-integr-t">③ 종합 시나리오 <span className="fes-cm-wk">W14</span></div>
          <div className="fes-cm-integr-d">장비 이상(압력·RF) → 식각 결과 비정상 → DRC width 오류 → 원인·조치 규명</div>
        </div>
        <span className="fes-cm-loop-ar big">→</span>
        <button className="fes-cm-node fes-cm-report" onClick={() => onOpen('report')}>
          <div className="fes-cm-node-top"><span className="fes-cm-ic">📝</span><div className="fes-cm-node-name"><b>Field Report</b><span>Problem·Observed·Cause·Action·Result</span></div></div>
          <div className="fes-cm-open">보고서 열기 →</div>
        </button>
      </div>

      {/* 평가 */}
      <div className="fes-cm-assess">
        <span className="fes-cm-assess-chip">중간고사 · W8 — 장비 구성/운전/로그/알람</span>
        <span className="fes-cm-assess-chip">기말고사 · W15 — 로그·매뉴얼·DRC/LVS 종합 해석</span>
        <span className="fes-cm-assess-note">※ 주차는 참고용 태그일 뿐, 수업은 위 4단계 루프로 진행</span>
      </div>
    </div>
  );
}

/* =========================================================================
 * 메인 컴포넌트
 * ====================================================================== */

export default function FieldEnglishSimulator({
  hideTabBar = false,       // 규격: 자료실에서 true (이 컴포넌트는 자기 UI만 그림)
  controlledTab,            // 규격: 'simulation' 로 들어옴 — 수신만, 무시
  onTabChange,              // 규격: 개념 변경 콜백(선택)
  initialTheme,             // 규격: 특정 개념으로 진입
  initialTab,               // 하위호환(기존 레포 관례)
  hideOtherTabs = false,    // 규격: 그 개념만 노출
}) {
  const first = THEME_IDS.includes(initialTheme) ? initialTheme
    : THEME_IDS.includes(initialTab) ? initialTab : 'overview';
  const [theme, setTheme] = useState(first);
  useEffect(() => { if (THEME_IDS.includes(initialTheme)) setTheme(initialTheme); }, [initialTheme]);

  const pick = (id) => { setTheme(id); onTabChange && onTabChange(id); };
  const cur = THEMES.find((t) => t.id === theme) || THEMES[0];

  const Body = {
    overview: <CourseMap onOpen={pick} />,
    weekly: <WeeklyLessons onOpen={pick} />,
    equipment: <EquipmentHMI />, alarm: <AlarmLab />, drc: <DrcLab />, lvs: <LvsLab />, report: <ReportLab />,
  }[theme];

  return (
    <div className="fes-root">
      <FesStyles />

      {!hideOtherTabs && (
        <div className="fes-header">
          <div className="fes-title">
            <span className="fes-title-en">Semiconductor Field English</span>
            <span className="fes-title-ko">반도체 현장 실무영어 · 읽고 판단하는 시뮬레이션</span>
          </div>
          <div className="fes-tabs">
            {THEMES.map((t) => (
              <button key={t.id} onClick={() => pick(t.id)} className={`fes-tab ${theme === t.id ? 'on' : ''}`} title={t.ko}>
                <span className="fes-tab-icon">{t.icon}</span>
                <span className="fes-tab-en">{t.en}</span>
                <span className="fes-tab-loop">{t.loop}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {hideOtherTabs && (
        <div className="fes-solo-head">
          <span className="fes-solo-icon">{cur.icon}</span>
          <span className="fes-solo-en">{cur.en}</span>
          <span className="fes-solo-ko">{cur.ko}</span>
          <span className="fes-solo-loop">Loop · {cur.loop}</span>
        </div>
      )}

      <div className="fes-body">{Body}</div>

      <div className="fes-footer">
        4-step loop: <b>Read manual → Operate → Interpret log/error → Report in English</b>
      </div>
    </div>
  );
}

/* =========================================================================
 * 스코프 스타일 (호스트 CSS 비의존)
 * ====================================================================== */
function FesStyles() {
  return (
    <style>{`
.fes-root{font-family:${C.sans};color:${C.text};background:linear-gradient(180deg,#0a1120,#0b1220);border:1px solid ${C.line};border-radius:14px;padding:16px;min-height:560px;box-sizing:border-box;line-height:1.5}
.fes-root *{box-sizing:border-box}
.fes-header{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:flex-end;border-bottom:1px solid ${C.line};padding-bottom:12px;margin-bottom:14px}
.fes-title{display:flex;flex-direction:column;gap:2px}
.fes-title-en{font-size:19px;font-weight:800;letter-spacing:.2px;color:#e8eefc;background:linear-gradient(90deg,${C.cyan},${C.violet});-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.fes-title-ko{font-size:12px;color:${C.dim}}
.fes-tabs{display:flex;flex-wrap:wrap;gap:6px}
.fes-tab{display:flex;flex-direction:column;align-items:center;gap:1px;background:${C.panel};border:1px solid ${C.line};color:${C.dim};border-radius:10px;padding:7px 11px;cursor:pointer;transition:.15s;min-width:78px}
.fes-tab:hover{border-color:${C.line2};color:${C.text}}
.fes-tab.on{background:linear-gradient(180deg,#15294a,#122038);border-color:${C.cyan};color:#fff;box-shadow:0 0 0 1px ${C.cyan}33,0 4px 14px #0006}
.fes-tab-icon{font-size:16px}
.fes-tab-en{font-size:11.5px;font-weight:700}
.fes-tab-loop{font-size:9px;text-transform:uppercase;letter-spacing:.6px;opacity:.7}
.fes-solo-head{display:flex;align-items:center;gap:10px;border-bottom:1px solid ${C.line};padding-bottom:10px;margin-bottom:14px}
.fes-solo-icon{font-size:22px}.fes-solo-en{font-size:17px;font-weight:800;color:#e8eefc}
.fes-solo-ko{font-size:12px;color:${C.dim}}
.fes-solo-loop{margin-left:auto;font-size:10px;text-transform:uppercase;letter-spacing:.6px;color:${C.cyan};border:1px solid ${C.cyan}55;border-radius:20px;padding:3px 9px}
.fes-footer{margin-top:14px;padding-top:10px;border-top:1px solid ${C.line};font-size:11.5px;color:${C.dim};text-align:center}
.fes-footer b{color:${C.text};font-weight:600}

/* term glossary */
.fes-term{position:relative;border-bottom:1px dotted ${C.cyan};cursor:help;color:#bfe9f5;outline:none}
.fes-tip{position:absolute;left:0;bottom:135%;z-index:30;width:230px;background:#0a1428;border:1px solid ${C.cyan}66;color:${C.text};font-size:11.5px;font-family:${C.sans};padding:8px 10px;border-radius:8px;box-shadow:0 8px 24px #000a;opacity:0;pointer-events:none;transition:.12s;transform:translateY(4px)}
.fes-term:hover .fes-tip,.fes-term:focus .fes-tip{opacity:1;transform:translateY(0)}

/* HMI */
.fes-stepbar{display:flex;align-items:center;margin-bottom:12px;overflow-x:auto;padding-bottom:4px}
.fes-step{display:flex;align-items:center;gap:5px;font-size:11px;color:${C.dim};white-space:nowrap}
.fes-step-dot{display:inline-flex;width:18px;height:18px;border-radius:50%;background:${C.panel2};border:1px solid ${C.line2};align-items:center;justify-content:center;font-size:10px;font-family:${C.mono}}
.fes-step.on{color:${C.text}}.fes-step.on .fes-step-dot{background:${C.cyan}22;border-color:${C.cyan};color:${C.cyan}}
.fes-step.cur .fes-step-dot{background:${C.cyan};color:#04121a;font-weight:700}
.fes-step-line{flex:1;min-width:14px;height:2px;background:${C.line2};margin:0 5px}.fes-step-line.on{background:${C.cyan}}
.fes-hmi{display:grid;grid-template-columns:130px 1fr 190px;gap:12px}
@media(max-width:720px){.fes-hmi{grid-template-columns:1fr}}
.fes-menu{display:flex;flex-direction:column;gap:4px}
.fes-menu-btn{text-align:left;background:${C.panel};border:1px solid ${C.line};color:${C.dim};border-radius:8px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer;transition:.12s}
.fes-menu-btn:hover{border-color:${C.line2};color:${C.text}}
.fes-menu-btn.on{background:${C.panel2};border-color:${C.cyan};color:#fff}
.fes-menu-btn.alarm{border-color:${C.red};color:${C.red};animation:fesBlink 1s infinite}
@keyframes fesBlink{50%{background:${C.red}22}}
.fes-screen{background:#08101f;border:1px solid ${C.line};border-radius:10px;padding:14px;min-height:210px}
.fes-scr-title{font-family:${C.mono};font-size:11px;letter-spacing:1px;color:${C.cyan};border-bottom:1px solid ${C.line};padding-bottom:6px;margin-bottom:10px}
.fes-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media(max-width:520px){.fes-grid2{grid-template-columns:1fr}}
.fes-readrow{display:flex;justify-content:space-between;gap:8px;background:${C.panel};border:1px solid ${C.line};border-radius:7px;padding:7px 9px}
.fes-readrow-l{font-size:11px;color:${C.dim}}.fes-readrow-v{font-size:12px;font-family:${C.mono};font-weight:600}
.fes-hint{font-size:11.5px;color:${C.dim};margin:10px 0 0}
.fes-tbl{width:100%;border-collapse:collapse;font-size:12px}
.fes-tbl td{border:1px solid ${C.line};padding:6px 9px;font-family:${C.mono}}
.fes-tbl td:first-child{color:${C.cyan}}
.fes-ol,.fes-task-ol{margin:0;padding-left:18px;font-size:12.5px;line-height:1.9}
.fes-ol b{color:${C.cyan}}
.fes-gauges{display:flex;flex-direction:column;gap:9px}
.fes-gauge{background:${C.panel};border:1px solid ${C.line};border-radius:9px;padding:9px 10px}
.fes-gauge-top{display:flex;justify-content:space-between;font-size:10.5px;font-family:${C.mono};color:${C.dim};margin-bottom:6px;letter-spacing:.5px}
.fes-gauge-bar{height:7px;background:#0a1526;border-radius:20px;overflow:hidden}.fes-gauge-bar>div{height:100%;border-radius:20px;transition:width .3s}
.fes-log{background:#060c17;border:1px solid ${C.line};border-radius:8px;padding:8px;max-height:180px;overflow:auto;font-family:${C.mono};font-size:11px}
.fes-log-embed{max-height:120px;margin-top:8px}
.fes-logrow{display:flex;gap:7px;padding:2px 0;align-items:baseline}
.fes-logrow.err span:last-child{color:${C.red}}
.fes-tag{font-size:9px;padding:1px 5px;border-radius:4px;font-weight:700;letter-spacing:.4px;flex:none}
.fes-tag-info{background:${C.blue}22;color:${C.blue}}.fes-tag-cmd{background:${C.violet}22;color:${C.violet}}
.fes-tag-alarm{background:${C.red}22;color:${C.red}}
.fes-alarm{background:${C.red}14;border:1px solid ${C.red}55;border-radius:8px;padding:12px}
.fes-alarm-code{color:${C.red};font-weight:800;font-family:${C.mono};margin-bottom:5px}
.fes-alarm-act{margin-top:7px;font-size:11px;color:${C.amber}}
.fes-ok{color:${C.emerald};font-size:12.5px}
.fes-dim{color:${C.dim};font-size:12px}
.fes-alarm-bar{display:flex;justify-content:space-between;align-items:center;gap:10px;background:${C.red}18;border:1px solid ${C.red}66;border-radius:9px;padding:9px 12px;margin-top:12px;font-family:${C.mono};font-size:12px;color:#ffd7d7}
.fes-controls{margin-top:12px}
.fes-inject{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:${C.amber};margin-bottom:8px;cursor:pointer}
.fes-btnrow{display:flex;flex-wrap:wrap;gap:7px}
.fes-btn{background:linear-gradient(180deg,#1a3252,#132542);border:1px solid ${C.cyan}55;color:#dff5fb;border-radius:8px;padding:8px 13px;font-size:12px;font-weight:700;cursor:pointer;transition:.12s}
.fes-btn:hover:not(:disabled){border-color:${C.cyan};box-shadow:0 0 0 1px ${C.cyan}33}
.fes-btn:disabled{opacity:.32;cursor:not-allowed}
.fes-btn.danger{background:linear-gradient(180deg,#3a1720,#2a1018);border-color:${C.red}66;color:#ffd7d7}
.fes-btn.danger:hover:not(:disabled){border-color:${C.red}}
.fes-btn.ghost{background:transparent;border-color:${C.line2};color:${C.dim}}

/* task card */
.fes-taskcard{margin-top:14px;background:linear-gradient(180deg,#0d1a30,#0b1526);border:1px solid ${C.line2};border-left:3px solid ${C.cyan};border-radius:9px;padding:12px 14px}
.fes-taskcard-h{font-family:${C.mono};font-size:10.5px;letter-spacing:1px;color:${C.cyan};margin-bottom:7px}
.fes-taskcard-b{font-size:12.5px;color:${C.text}}
.fes-task-ol b{color:#e8eefc}

/* alarm lab */
.fes-casebar{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.fes-chip{background:${C.panel};border:1px solid ${C.line};color:${C.dim};border-radius:20px;padding:5px 13px;font-size:11.5px;font-family:${C.mono};font-weight:600;cursor:pointer}
.fes-chip.on{background:${C.cyan}18;border-color:${C.cyan};color:${C.cyan}}
.fes-alarm-panel{background:#0e0a10;border:1px solid ${C.red}44;border-radius:10px;padding:14px}
.fes-alarm-head{font-family:${C.mono};font-size:12px;color:${C.red};font-weight:700;margin-bottom:8px;letter-spacing:.5px}
.fes-alarm-msg{font-size:14px;color:#ffe3e3;line-height:1.6;margin-bottom:4px}
.fes-qs{display:grid;gap:10px;margin-top:14px}
.fes-q{background:${C.panel};border:1px solid ${C.line};border-radius:10px;padding:12px}
.fes-q-prompt{font-size:12.5px;font-weight:700;color:#e8eefc;margin-bottom:9px}
.fes-q-opts{display:grid;gap:6px}
.fes-opt{text-align:left;background:#0b1424;border:1px solid ${C.line2};color:${C.text};border-radius:8px;padding:9px 12px;font-size:12.5px;cursor:pointer;transition:.12s}
.fes-opt:hover:not(:disabled){border-color:${C.cyan}}
.fes-opt.sel{border-color:${C.cyan};background:${C.cyan}14}
.fes-opt.right{border-color:${C.emerald};background:${C.emerald}18;color:#d7ffe9}
.fes-opt.wrong{border-color:${C.red};background:${C.red}18;color:#ffd7d7}
.fes-opt:disabled{cursor:default}
.fes-check-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:14px}
.fes-score{font-family:${C.mono};font-weight:700;font-size:13px;padding:5px 12px;border-radius:8px}
.fes-score.ok{background:${C.emerald}18;color:${C.emerald}}.fes-score.mid{background:${C.amber}18;color:${C.amber}}.fes-score.bad{background:${C.red}18;color:${C.red}}
.fes-fix{font-size:12px;color:${C.emerald}}

/* DRC / CAD */
.fes-cad{border:1px solid ${C.line};border-radius:10px;overflow:hidden;background:#0a0f1a}
.fes-cad-svg{width:100%;display:block}
.fes-sliders{display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap;margin:14px 0}
.fes-slider{flex:1;min-width:190px}
.fes-slider-top{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
.fes-slider-req{font-size:10px;color:${C.dim};font-family:${C.mono};margin-top:2px}
.fes-range{width:100%;accent-color:${C.cyan}}
.fes-drc-out{background:#060c17;border:1px solid ${C.line};border-radius:10px;padding:14px}
.fes-viol{background:${C.red}10;border:1px solid ${C.red}44;border-radius:8px;padding:10px 12px;margin-top:8px;font-family:${C.mono}}
.fes-viol-head{color:${C.red};font-weight:700;font-size:12.5px;margin-bottom:4px}
.fes-viol-body{color:#ffd7d7;font-size:12px}

/* LVS */
.fes-lvs{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center}
@media(max-width:560px){.fes-lvs{grid-template-columns:1fr}}
.fes-lvs-col{background:#0a0f1a;border:1px solid ${C.line};border-radius:10px;padding:10px}
.fes-lvs-title{font-family:${C.mono};font-size:10.5px;color:${C.cyan};letter-spacing:.6px;text-align:center;margin-bottom:6px}
.fes-lvs-svg{width:100%;height:auto;display:block}
.fes-lvs-vs{font-size:22px;color:${C.red};text-align:center;font-weight:700}

/* report */
.fes-scn{background:#0d1a30;border:1px solid ${C.line2};border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px}
.fes-report{display:grid;gap:10px}
.fes-report-field{display:flex;flex-direction:column;gap:5px}
.fes-report-label{font-family:${C.mono};font-size:12px;color:${C.cyan};font-weight:700}
.fes-ta{background:#0b1424;border:1px solid ${C.line2};color:${C.text};border-radius:8px;padding:9px 11px;font-size:13px;font-family:${C.sans};resize:vertical}
.fes-ta:focus{outline:none;border-color:${C.cyan}}
.fes-model{font-size:12px;color:${C.emerald};background:${C.emerald}12;border-left:2px solid ${C.emerald};padding:6px 10px;border-radius:0 6px 6px 0}
.fes-rubric{display:flex;align-items:center;gap:9px;font-size:12px;color:${C.dim}}
.fes-rubric-bar{width:120px;height:7px;background:#0a1526;border-radius:20px;overflow:hidden}.fes-rubric-bar>div{height:100%;background:${C.emerald};transition:width .3s}
.fes-mono{font-family:${C.mono};font-size:11px}

/* Course Map (instructor console) */
.fes-cm-phil{background:linear-gradient(180deg,#0d1a30,#0b1526);border:1px solid ${C.line2};border-left:3px solid ${C.cyan};border-radius:10px;padding:12px 15px;font-size:13px;line-height:1.7;color:${C.text}}
.fes-cm-phil b{color:#e8eefc;display:block;margin-bottom:2px}
.fes-cm-hl{color:${C.cyan};font-weight:700}
.fes-cm-loop{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:14px 0}
.fes-cm-loop-chip{display:flex;align-items:center;gap:7px;background:${C.panel};border:1px solid ${C.line2};border-radius:22px;padding:7px 14px;font-size:12.5px;font-weight:600;color:#e8eefc}
.fes-cm-loop-chip span{display:inline-flex;width:19px;height:19px;border-radius:50%;background:${C.cyan};color:#04121a;font-family:${C.mono};font-size:11px;font-weight:700;align-items:center;justify-content:center}
.fes-cm-loop-ar{color:${C.cyan};font-size:17px}.fes-cm-loop-ar.big{font-size:26px}
.fes-cm-loop-tag{margin-left:auto;font-size:10px;letter-spacing:.6px;text-transform:uppercase;color:${C.dim};border:1px solid ${C.line2};border-radius:20px;padding:4px 10px}
.fes-cm-emph{display:flex;gap:4px;margin-bottom:16px;font-size:11px;font-weight:600}
.fes-cm-emph-a{flex:6;background:linear-gradient(90deg,${C.cyan}22,${C.cyan}11);border:1px solid ${C.cyan}44;color:#bfe9f5;border-radius:8px 3px 3px 8px;padding:9px 12px;text-align:center}
.fes-cm-emph-b{flex:4;background:linear-gradient(90deg,${C.violet}18,${C.violet}0d);border:1px solid ${C.violet}44;color:#d9ccff;border-radius:3px 8px 8px 3px;padding:9px 12px;text-align:center}
.fes-cm-lanes{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:640px){.fes-cm-lanes{grid-template-columns:1fr}}
.fes-cm-lane{display:flex;flex-direction:column;gap:10px}
.fes-cm-lane-h{font-family:${C.mono};font-size:12px;font-weight:700;letter-spacing:.4px;padding:8px 12px;border-radius:8px}
.fes-cm-lane-h.fes-a{background:${C.cyan}14;color:${C.cyan};border:1px solid ${C.cyan}40}
.fes-cm-lane-h.fes-b{background:${C.violet}14;color:${C.violet};border:1px solid ${C.violet}40}
.fes-cm-node{display:block;width:100%;text-align:left;background:${C.panel};border:1px solid ${C.line2};border-radius:11px;padding:13px 15px;cursor:pointer;transition:.14s}
.fes-cm-node:hover{border-color:${C.cyan};background:${C.panel2};transform:translateY(-1px);box-shadow:0 6px 18px #0007}
.fes-cm-node-top{display:flex;align-items:center;gap:11px}
.fes-cm-ic{font-size:26px}
.fes-cm-node-name{display:flex;flex-direction:column;flex:1}
.fes-cm-node-name b{color:#e8eefc;font-size:15px}
.fes-cm-node-name span{color:${C.dim};font-size:11.5px}
.fes-cm-wk{font-family:${C.mono};font-size:10.5px;color:${C.amber};border:1px solid ${C.amber}44;border-radius:20px;padding:2px 9px;flex:none}
.fes-cm-terms{display:flex;flex-wrap:wrap;gap:5px;margin:9px 0}
.fes-cm-term{font-family:${C.mono};font-size:10.5px;color:${C.text};background:#0b1424;border:1px solid ${C.line2};border-radius:5px;padding:2px 7px}
.fes-cm-tip{font-size:11px;color:${C.dim};margin-bottom:7px}
.fes-cm-open{font-size:11.5px;font-weight:700;color:${C.cyan}}
.fes-cm-integr{display:flex;align-items:stretch;gap:12px;margin-top:14px;flex-wrap:wrap}
.fes-cm-integr-l{flex:1;min-width:260px;background:linear-gradient(135deg,#12233b,#0e1a2e);border:1px solid ${C.emerald}44;border-radius:11px;padding:14px 16px}
.fes-cm-integr-t{font-size:15px;font-weight:800;color:#e8eefc;display:flex;align-items:center;gap:8px;margin-bottom:5px}
.fes-cm-integr-d{font-size:12px;color:${C.text};line-height:1.6}
.fes-cm-report{width:auto;min-width:230px;align-self:center;border-color:${C.emerald}55}
.fes-cm-report:hover{border-color:${C.emerald}}
.fes-cm-assess{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px;padding-top:12px;border-top:1px solid ${C.line}}
.fes-cm-assess-chip{font-size:11.5px;color:#e8eefc;background:${C.panel};border:1px solid ${C.line2};border-radius:7px;padding:7px 12px}
.fes-cm-assess-note{font-size:10.5px;color:${C.dim};margin-left:auto}

/* Weekly lessons */
.fes-wk-rail{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px}
.fes-wk-chip{background:${C.panel};border:1px solid ${C.line2};color:${C.dim};border-radius:8px;padding:6px 10px;font-family:${C.mono};font-size:11.5px;font-weight:700;cursor:pointer;transition:.12s}
.fes-wk-chip:hover:not(:disabled){border-color:${C.cyan};color:${C.text}}
.fes-wk-chip.on{background:${C.cyan}18;border-color:${C.cyan};color:${C.cyan}}
.fes-wk-chip.off{opacity:.4;cursor:not-allowed}
.fes-wk-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.fes-wk-head-t{font-size:16px;color:#e8eefc}.fes-wk-head-t b{color:${C.cyan}}
.fes-wk-soon{font-size:10.5px;color:${C.amber};border:1px solid ${C.amber}55;border-radius:20px;padding:3px 10px}
.fes-wk-placeholder{background:${C.panel};border:1px dashed ${C.line2};border-radius:12px;padding:26px;text-align:center;color:${C.dim};font-size:13px}
.fes-wk-placeholder b{color:${C.text}}
.fes-wk-ph-btns{display:flex;gap:8px;justify-content:center;margin-top:14px}

/* Lesson deck (PPT-style) */
.fes-ld-dots{display:flex;gap:7px;justify-content:center;margin-bottom:12px}
.fes-ld-dot{width:34px;height:6px;border-radius:20px;background:#1b2c48;border:none;cursor:pointer;transition:.15s;padding:0}
.fes-ld-dot.done{background:${C.cyan}66}
.fes-ld-dot.on{background:${C.cyan};box-shadow:0 0 0 3px ${C.cyan}22}
.fes-ld-slide{background:#08101f;border:1px solid ${C.line};border-radius:12px;padding:20px 22px;min-height:280px}
.fes-ld-title{font-size:18px;font-weight:800;color:#e8eefc;margin-bottom:16px;display:flex;flex-direction:column;gap:6px}
.fes-ld-step{font-family:${C.mono};font-size:11px;letter-spacing:1px;color:${C.cyan};font-weight:700}
.fes-ld-body{font-size:14px;line-height:1.7}
.fes-ld-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px}
.fes-ld-count{font-family:${C.mono};font-size:12px;color:${C.dim}}
.fes-wk-p{font-size:15px;line-height:1.8;color:${C.text}}.fes-wk-p b{color:${C.cyan}}
.fes-wk-hint{font-size:12.5px;color:${C.dim};margin:14px 0 0}.fes-wk-hint b{color:${C.text}}
.fes-wk-roles{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media(max-width:600px){.fes-wk-roles{grid-template-columns:1fr}}
.fes-wk-role{background:${C.panel};border:1px solid ${C.line2};border-radius:11px;padding:14px}
.fes-wk-role-h{display:flex;align-items:center;gap:8px;font-size:15px;color:#e8eefc;margin-bottom:8px}
.fes-wk-role-h span{font-size:22px}
.fes-wk-role-en{font-size:12.5px;color:${C.text};line-height:1.6;margin-bottom:8px}
.fes-wk-role-ko{font-size:11.5px;color:${C.dim};border-top:1px solid ${C.line};padding-top:8px}
.fes-wk-diag{display:grid;grid-template-columns:1.4fr 1fr;gap:14px;align-items:center}
@media(max-width:600px){.fes-wk-diag{grid-template-columns:1fr}}
.fes-wk-svg{width:100%;border:1px solid ${C.line};border-radius:10px;display:block}
.fes-wk-partinfo{background:${C.panel};border:1px solid ${C.line2};border-left:3px solid ${C.cyan};border-radius:10px;padding:14px}
.fes-wk-partinfo-en{font-size:17px;font-weight:800;color:${C.cyan}}
.fes-wk-partinfo-ko{font-size:12px;color:${C.dim};font-weight:400;margin-left:6px}
.fes-wk-partinfo-desc{font-size:13.5px;color:${C.text};line-height:1.6;margin-top:8px}
.fes-wk-partinfo-hint{font-size:11px;color:${C.dim};margin-top:12px}
.fes-wk-manual{background:#060c17;border:1px solid ${C.line};border-radius:10px;padding:16px 18px}
.fes-wk-manual-h{font-family:${C.mono};font-size:11px;letter-spacing:1px;color:${C.cyan};margin-bottom:10px}
.fes-wk-manual p{font-size:14.5px;line-height:1.9;color:${C.text};margin:0}
.fes-wk-manual b{color:#bfe9f5;font-weight:700}
.fes-wk-quiz-intro{font-size:12.5px;color:${C.dim};margin:0 0 12px}
.fes-wk-qn{font-family:${C.mono};color:${C.cyan};font-size:12px;margin-right:4px}
.fes-wk-story{display:flex;gap:14px;align-items:flex-start;background:linear-gradient(135deg,#132338,#0e1a2e);border:1px solid ${C.line2};border-left:3px solid ${C.amber};border-radius:12px;padding:16px 18px;font-size:14px;line-height:1.8;color:${C.text}}
.fes-wk-story-ic{font-size:30px;flex:none}
.fes-wk-story b{color:${C.amber}}.fes-wk-story i{color:#bfe9f5;font-style:italic}
.fes-wk-gloss{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:600px){.fes-wk-gloss{grid-template-columns:1fr 1fr}}
.fes-wk-gloss-item{background:${C.panel};border:1px solid ${C.line2};border-radius:10px;padding:12px}
.fes-wk-gloss-en{font-size:16px;font-weight:800;color:${C.cyan}}
.fes-wk-gloss-ko{font-size:12px;color:#e8eefc;margin:2px 0 6px}
.fes-wk-gloss-d{font-size:11.5px;color:${C.dim};line-height:1.5}
.fes-wk-table{width:100%;border-collapse:collapse;font-size:13px}
.fes-wk-table th{background:${C.panel};color:${C.cyan};font-family:${C.mono};font-size:11px;letter-spacing:.5px;text-align:left;padding:9px 12px;border:1px solid ${C.line2}}
.fes-wk-table td{border:1px solid ${C.line};padding:9px 12px;color:${C.text};vertical-align:top}
.fes-wk-td-en{color:#bfe9f5;font-family:${C.mono};font-weight:700}
`}</style>
  );
}
