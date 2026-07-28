import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CONTENT_CHAPTERS } from '../data/fieldEnglishChapters.data';
import { ART } from '../data/fieldEnglishArt.data';

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
  { id: 'overview', en: 'Course Map', ko: '책 개요', icon: '🗺️', loop: 'Overview' },
  { id: 'chapters', en: 'Chapters', ko: '교재 (챕터)', icon: '📖', loop: 'Study' },
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
  blue: '#3b82f6',      // Tech Innovation · Electric Blue
  elec: '#2f6bff',      // electric blue (primary accent)
  neon: '#22d3ee',      // neon cyan (highlight)
  mono: "'DejaVu Sans Mono','SF Mono','Roboto Mono',ui-monospace,monospace",
  sans: "'DejaVu Sans','Segoe UI',system-ui,-apple-system,sans-serif",
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
  // 약어(acronym) — 단독으로 쓰일 때 풀어서 설명
  drc: 'DRC (Design Rule Check) — 레이아웃이 디자인 규칙을 지켰는지 자동 검사',
  lvs: 'LVS (Layout Versus Schematic) — 레이아웃이 회로도(설계)와 같은지 비교',
  mfc: 'MFC (Mass Flow Controller) — 가스 유량을 조절·제어하는 장치',
  rf: 'RF (Radio Frequency) — 플라즈마를 만드는 고주파 전력',
  hmi: 'HMI (Human-Machine Interface) — 장비를 조작·감시하는 화면',
  pm: 'PM (Preventive Maintenance) — 고장을 예방하는 정기 점검·정비',
  eds: 'EDS (Electrical Die Sorting) — 웨이퍼 상태에서 칩의 전기적 양·불량 선별',
  sccm: 'sccm (standard cubic centimeter per minute) — 표준 상태 기준 분당 유량 단위',
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

const PROGRESS_KEY = 'fes-fieldEnglish-progress';

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

// 재사용 쓰기 블록 (해석/영작 — 모범답안 self-check)
function WriteBlock({ prompt, hint, model }) {
  const [v, setV] = useState('');
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="fes-wr-prompt">{prompt}</div>
      <textarea className="fes-ta" rows={3} placeholder={hint || '여기에 작성하세요...'} value={v} onChange={(e) => setV(e.target.value)} />
      <div className="fes-check-row">
        <span className="fes-ld-count">{v.trim().length}자 작성</span>
        <button className="fes-btn ghost" onClick={() => setShow((s) => !s)}>{show ? '모범답안 숨기기' : '모범답안 보기'}</button>
      </div>
      {show && <div className="fes-model"><b>Model:</b> {model}</div>}
    </div>
  );
}

/* ---- 콘텐츠 데이터 (범용: Semifabai 등에서 이 배열만 갈아끼우면 재사용) ---- */
const W1_ROLES = [
  { icon: '🛠️', role: 'Equipment Engineer', duty: 'Operates and maintains process equipment; reads English alarms and manuals.', ko: '장비 엔지니어 — 장비 운전·정비, 영문 알람·매뉴얼 해석' },
  { icon: '🧪', role: 'Process Engineer', duty: 'Sets recipes and analyzes process logs and English data sheets.', ko: '공정 엔지니어 — 레시피 설정, 영문 로그·데이터 분석' },
  { icon: '📐', role: 'Design Engineer', duty: 'Draws layouts and fixes DRC / LVS errors written in English.', ko: '설계 엔지니어 — 레이아웃 작성, 영문 DRC/LVS 오류 수정' },
];
const W1_GLOSSARY = [
  { en: 'Wafer', ko: '웨이퍼', d: '반도체를 만드는 얇은 원판.', ex: 'Load the wafer onto the chuck.' },
  { en: 'Chamber', ko: '챔버', d: '공정이 일어나는 진공 공간.', ex: 'The chamber is under vacuum.' },
  { en: 'Pressure', ko: '압력', d: '챔버 안 기체의 압력.', ex: 'Chamber pressure is too high.' },
  { en: 'Recipe', ko: '레시피', d: '가스·압력·시간 등 공정 조건.', ex: 'Load recipe ETCH-01.' },
  { en: 'Process', ko: '공정', d: '웨이퍼를 가공하는 단계.', ex: 'The process has stopped.' },
  { en: 'Etch', ko: '식각', d: '표면을 깎아내는 공정.', ex: 'The etch rate is stable.' },
];
const W1_TERMS = [
  { prompt: '“Wafer” 의 뜻은?', opts: ['웨이퍼 (반도체 기판)', '진공', '식각'], ans: 0 },
  { prompt: '“Chamber” 의 뜻은?', opts: ['레시피', '챔버 (공정이 일어나는 공간)', '밸브'], ans: 1 },
  { prompt: '“Pressure” 의 뜻은?', opts: ['압력', '증착', '층(layer)'], ans: 0 },
  { prompt: '“Recipe” 의 뜻은?', opts: ['식각', '공정 조건표 (레시피)', '펌프'], ans: 1 },
  { prompt: '“Etch” 의 뜻은?', opts: ['쌓다 (증착)', '깎아내다 (식각)', '읽다'], ans: 1 },
  { prompt: '“Process” 의 뜻은?', opts: ['공정', '진공', '알람'], ans: 0 },
];
// 문장 해석 (난이도 ↑) — 실제 현장 문장 이해
const W1_SENT = [
  { prompt: '“Chamber pressure is above the allowable limit.”', opts: ['압력이 허용치보다 높다', '압력이 정상이다', '가스가 부족하다'], ans: 0 },
  { prompt: '“The process has been stopped by the interlock.”', opts: ['공정이 정상 완료됐다', '인터록 때문에 공정이 멈췄다', '레시피를 바꿨다'], ans: 1 },
  { prompt: '“Pump down to base pressure before starting the process.”', opts: ['공정 시작 전 기준 압력까지 배기하라', '공정 후에 벤트하라', '가스를 먼저 넣어라'], ans: 0 },
];
// 현장 둘러보기 — 이 책에서 배울 5개 영역 맛보기 (첫날 오리엔테이션용)
const W1_TOUR = [
  { ic: '🖥️', area: 'Equipment · 장비', en: '“Load the wafer and pump down.”', ko: '영어 지시로 장비를 운전' },
  { ic: '🚨', area: 'Alarm · 알람', en: '“Stopped by the interlock.”', ko: '영문 알람을 해석' },
  { ic: '📐', area: 'DRC · 디자인 규칙 검사', en: '“METAL1.SPACING violation.”', ko: 'DRC = Design Rule Check · 디자인 오류 읽기' },
  { ic: '🔗', area: 'LVS · 레이아웃 검증', en: '“Missing device in the layout.”', ko: 'LVS = Layout Versus Schematic · 레이아웃 vs 회로도' },
  { ic: '📝', area: 'Report · 보고', en: '“Problem / Cause / Action…”', ko: '영문 현장 보고서' },
];
// 현장 영어가 나오는 3곳 — 매뉴얼 · 지시문 · HMI 화면
const W1_SOURCES = [
  { ic: '📄', k: 'Manual · 매뉴얼', en: 'The turbo pump evacuates the chamber to base pressure.', ko: '장비 설명서의 설명 문장' },
  { ic: '📋', k: 'Instruction · 작업 지시문', en: 'Load the wafer, pump down, then start the gas.', ko: '작업 절차·지시 문장' },
  { ic: '🖥️', k: 'HMI screen · 장비 화면(GUI)', en: 'Chamber pressure is above the allowable limit.', ko: '장비 화면에 뜨는 영어 메시지' },
];
const W1_SRC_Q = [
  { prompt: '“evacuates the chamber” 의 뜻은?', opts: ['챔버를 배기한다', '챔버를 채운다', '챔버를 연다'], ans: 0 },
  { prompt: '지시문 “pump down, then start the gas” 순서는?', opts: ['배기 → 가스', '가스 → 배기', '벤트 → 배기'], ans: 0 },
  { prompt: 'HMI 메시지 “above the allowable limit” 은?', opts: ['허용치보다 높다', '허용치 안이다', '측정 불가'], ans: 0 },
];

const W2_PARTS = [
  { id: 'chamber', en: 'Chamber', ko: '챔버', desc: 'The sealed vacuum space where the process (etching) takes place.', role: '공정이 일어나는 밀폐 진공 공간', x: 130, y: 60, w: 200, h: 150 },
  { id: 'chuck', en: 'Wafer chuck', ko: '척 (웨이퍼 받침)', desc: 'Holds the wafer flat and often controls its temperature.', role: '웨이퍼를 고정하고 온도를 관리', x: 190, y: 170, w: 80, h: 18 },
  { id: 'gas', en: 'Gas line (MFC)', ko: '가스 라인 / 질량유량제어기', desc: 'Delivers the process gas; the MFC sets the exact flow (sccm).', role: '공정 가스를 공급, MFC가 유량을 정밀 제어', x: 198, y: 12, w: 64, h: 26 },
  { id: 'rf', en: 'RF generator', ko: 'RF 전원', desc: 'Supplies RF (Radio Frequency) power to ignite and sustain the plasma.', role: '플라즈마를 만들고 유지하는 고주파 전력', x: 16, y: 150, w: 88, h: 34 },
  { id: 'valve', en: 'Gate valve', ko: '게이트 밸브', desc: 'Opens or closes the path between the chamber and the pump.', role: '챔버와 펌프 사이 통로를 여닫음', x: 204, y: 214, w: 52, h: 16 },
  { id: 'pump', en: 'Turbo pump', ko: '터보 펌프', desc: 'Evacuates the chamber down to base pressure (high vacuum).', role: '챔버를 기준 압력(고진공)까지 배기', x: 190, y: 234, w: 80, h: 26 },
];
const W2_QUIZ = [
  { prompt: '“The vacuum space where the process happens.”', opts: ['Chamber', 'Pump', 'Recipe'], ans: 0 },
  { prompt: '“Delivers and controls the process gas flow.”', opts: ['RF generator', 'Gas line (MFC)', 'Wafer chuck'], ans: 1 },
  { prompt: '“Supplies RF power to generate plasma.”', opts: ['RF generator', 'Gate valve', 'Turbo pump'], ans: 0 },
  { prompt: '“Evacuates the chamber down to vacuum.”', opts: ['Wafer chuck', 'Turbo pump', 'Gas line'], ans: 1 },
  { prompt: '“Holds the wafer during the process.”', opts: ['Wafer chuck', 'Gate valve', 'Chamber'], ans: 0 },
];

const PART_SPEC = [
  { id: 'gas', n: 1, at: [211, 96], en: 'Gas inlet (showerhead)', ko: '가스 주입구·샤워헤드', desc: 'Delivers process gas uniformly through the showerhead. The MFC sets the exact flow.' },
  { id: 'chamber', n: 2, at: [118, 82], en: 'Chamber', ko: '챔버', desc: 'The sealed vacuum space where etching takes place.' },
  { id: 'plasma', n: 3, at: [211, 152], en: 'Plasma', ko: '플라즈마', desc: 'Ionized gas that etches the wafer surface, driven by RF power.' },
  { id: 'chuck', n: 4, at: [211, 236], en: 'Wafer chuck (ESC)', ko: '정전 척·웨이퍼', desc: 'Holds the wafer flat and controls its temperature during the process.' },
  { id: 'rf', n: 5, at: [54, 200], en: 'RF power / match', ko: 'RF 전원·매칭', desc: 'Supplies RF power (through the matching network) to the chuck electrode to ignite and sustain the plasma.' },
  { id: 'pump', n: 6, at: [258, 290], en: 'Turbo pump / gate valve', ko: '터보 펌프·게이트 밸브', desc: 'Evacuates the chamber to base pressure; the gate valve isolates the pump.' },
];

function PartDiagram() {
  const [sel, setSel] = useState('chamber');
  const cur = PART_SPEC.find((p) => p.id === sel);
  const hl = (id) => (sel === id ? C.neon : '#42557a');
  const hw = (id) => (sel === id ? 2.4 : 1.3);
  return (
    <div className="fes-wk-diag">
      <div className="fes-pd-wrap">
        <svg viewBox="0 0 480 340" className="fes-illus-svg">
          <defs>
            <linearGradient id="pdSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1e2a44" /><stop offset="1" stopColor="#0d1524" /></linearGradient>
            <linearGradient id="pdChuck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#33456a" /><stop offset="1" stopColor="#161f36" /></linearGradient>
            <radialGradient id="pdPlasma" cx="50%" cy="50%" r="55%"><stop offset="0" stopColor="#d4c9ff" stopOpacity="0.95" /><stop offset="42%" stopColor="#a78bfa" stopOpacity="0.4" /><stop offset="100%" stopColor="#7c6bd6" stopOpacity="0" /></radialGradient>
            <linearGradient id="pdWafer" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2f6bff" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
            <marker id="pdArrG" markerWidth="11" markerHeight="11" refX="5.5" refY="9" orient="auto"><path d="M1 1L5.5 9L10 1" fill="none" stroke={C.emerald} strokeWidth="1.6" /></marker>
            <marker id="pdArrC" markerWidth="11" markerHeight="11" refX="5.5" refY="9" orient="auto"><path d="M1 1L5.5 9L10 1" fill="none" stroke={C.neon} strokeWidth="1.6" /></marker>
          </defs>
          <rect width="480" height="340" rx="10" fill="#080c15" />
          <text x="20" y="26" fill={C.dim} fontSize="11" fontFamily={C.mono} letterSpacing="1.5">PLASMA ETCH CHAMBER — CROSS SECTION</text>

          {/* gas inlet: valve + pipe */}
          <g onClick={() => setSel('gas')} style={{ cursor: 'pointer' }}>
            <circle cx="211" cy="34" r="7" fill="#101a30" stroke={hl('gas')} strokeWidth={hw('gas')} />
            <line x1="207" y1="34" x2="215" y2="34" stroke={hl('gas')} strokeWidth={hw('gas')} /><line x1="211" y1="30" x2="211" y2="38" stroke={hl('gas')} strokeWidth={hw('gas')} />
            <line x1="211" y1="41" x2="211" y2="80" stroke={hl('gas')} strokeWidth={hw('gas') + 0.8} markerEnd="url(#pdArrC)" />
          </g>

          {/* chamber body (double wall) */}
          <rect x="96" y="64" width="230" height="214" rx="14" fill="url(#pdSteel)" stroke={hl('chamber')} strokeWidth={hw('chamber') + 0.7} onClick={() => setSel('chamber')} style={{ cursor: 'pointer' }} />
          <rect x="106" y="74" width="210" height="194" rx="8" fill="none" stroke="#26344f" strokeWidth="1" />

          {/* gas plenum + showerhead plate */}
          <g onClick={() => setSel('gas')} style={{ cursor: 'pointer' }}>
            <rect x="156" y="80" width="110" height="10" rx="2" fill="#22314e" stroke={hl('gas')} strokeWidth={hw('gas')} />
            <rect x="156" y="90" width="110" height="7" fill="#16233b" stroke={hl('gas')} strokeWidth={hw('gas') * 0.8} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <circle key={k} cx={168 + k * 14} cy={97.5} r="1.9" fill={C.neon} opacity="0.8" />)}
          </g>

          {/* plasma region + sheath edges */}
          <g onClick={() => setSel('plasma')} style={{ cursor: 'pointer' }}>
            <ellipse cx="211" cy="152" rx="74" ry="48" fill="url(#pdPlasma)" />
            <line x1="150" y1="106" x2="272" y2="106" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            <line x1="152" y1="208" x2="270" y2="208" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            {[[196, 138], [222, 132], [238, 150], [204, 162], [230, 168], [212, 148]].map(([x, yy], i) => <circle key={i} cx={x} cy={yy} r="2.2" fill="#e9e3ff" opacity="0.92" />)}
            {sel === 'plasma' && <ellipse cx="211" cy="152" rx="80" ry="54" fill="none" stroke={C.neon} strokeWidth="1.3" strokeDasharray="5 4" />}
          </g>

          {/* chuck electrode + wafer */}
          <g onClick={() => setSel('chuck')} style={{ cursor: 'pointer' }}>
            <path d="M180 252 L188 220 L234 220 L242 252 Z" fill="url(#pdChuck)" stroke={hl('chuck')} strokeWidth={hw('chuck')} />
            <rect x="182" y="216" width="58" height="6" rx="1" fill="#3a4d72" stroke={hl('chuck')} strokeWidth={hw('chuck') * 0.7} />
            <ellipse cx="211" cy="215" rx="45" ry="4.5" fill="url(#pdWafer)" />
            <path d="M254 215 l-6 -2.4 v4.8 z" fill="#0d1524" />
          </g>

          {/* RF box + cable to electrode */}
          <g onClick={() => setSel('rf')} style={{ cursor: 'pointer' }}>
            <rect x="18" y="214" width="66" height="40" rx="7" fill="#101a30" stroke={hl('rf')} strokeWidth={hw('rf')} />
            <text x="51" y="231" textAnchor="middle" fill={sel === 'rf' ? C.neon : C.violet} fontSize="12" fontFamily={C.mono} fontWeight="700">RF</text>
            <text x="51" y="245" textAnchor="middle" fill={C.dim} fontSize="8.5" fontFamily={C.mono} letterSpacing="1">MATCH</text>
            <path d="M84 236 C 130 236 150 244 188 246" fill="none" stroke={hl('rf')} strokeWidth={hw('rf') + 0.3} />
            <circle cx="188" cy="246" r="2.4" fill={hl('rf')} />
          </g>

          {/* foreline: gate valve + turbo pump + exhaust */}
          <g onClick={() => setSel('pump')} style={{ cursor: 'pointer' }}>
            <line x1="211" y1="278" x2="211" y2="284" stroke={hl('pump')} strokeWidth={hw('pump') + 3} />
            <rect x="191" y="284" width="40" height="12" rx="2" fill="#22314e" stroke={hl('pump')} strokeWidth={hw('pump')} />
            <line x1="197" y1="290" x2="225" y2="290" stroke={hl('pump')} strokeWidth={hw('pump') * 0.8} />
            <rect x="183" y="300" width="56" height="30" rx="7" fill="#101a30" stroke={hl('pump')} strokeWidth={hw('pump')} />
            <text x="211" y="319" textAnchor="middle" fill={sel === 'pump' ? C.neon : C.emerald} fontSize="10.5" fontFamily={C.mono} fontWeight="700">TURBO PUMP</text>
            <line x1="239" y1="315" x2="268" y2="315" stroke={C.emerald} strokeWidth="2" markerEnd="url(#pdArrG)" />
            <text x="274" y="312" fill={C.emerald} fontSize="9" fontFamily={C.mono}>exhaust</text>
          </g>

          {/* number badges */}
          {PART_SPEC.map((p) => (
            <g key={p.id} onClick={() => setSel(p.id)} style={{ cursor: 'pointer' }}>
              <circle cx={p.at[0]} cy={p.at[1]} r="10.5" fill={sel === p.id ? C.elec : '#0b1220'} stroke={sel === p.id ? C.neon : '#54668a'} strokeWidth="1.5" />
              <text x={p.at[0]} y={p.at[1] + 4} textAnchor="middle" fill={sel === p.id ? '#fff' : '#a9bcd6'} fontSize="11" fontFamily={C.mono} fontWeight="700">{p.n}</text>
            </g>
          ))}
        </svg>
        {/* legend */}
        <div className="fes-pd-legend">
          {PART_SPEC.map((p) => (
            <button key={p.id} onClick={() => setSel(p.id)} className={`fes-pd-leg ${sel === p.id ? 'on' : ''}`}>
              <span className="fes-pd-num">{p.n}</span>
              <span><b>{p.en}</b><span className="fes-pd-ko">{p.ko}</span></span>
            </button>
          ))}
        </div>
      </div>
      <div className="fes-wk-partinfo">
        <div className="fes-wk-partinfo-en">{cur.en} <span className="fes-wk-partinfo-ko">{cur.ko}</span></div>
        <div className="fes-wk-partinfo-desc">{cur.desc}</div>
        <div className="fes-wk-partinfo-hint">👆 그림의 번호나 아래 목록을 클릭하면 부품이 강조됩니다.</div>
      </div>
    </div>
  );
}

// PPT처럼 한 화면씩 넘기는 슬라이드 뷰어 — 강의자는 '다음'만 누르면 순서대로 진행.
// 마지막 슬라이드 도달 시 onReachEnd(chapterId) 로 챕터 완료를 알린다.
function LessonDeck({ steps, chapterId, onReachEnd }) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;
  useEffect(() => { if (last && onReachEnd) onReachEnd(chapterId); }, [last, chapterId, onReachEnd]);
  return (
    <div className="fes-ld">
      <div className="fes-ld-dots">
        {steps.map((s, j) => (
          <button key={j} onClick={() => setI(j)}
            className={`fes-ld-dot ${j === i ? 'on' : ''} ${j < i ? 'done' : ''}`} title={s.title} />
        ))}
      </div>
      <div className="fes-ld-slide">
        <div className="fes-ld-head">
          <span className="fes-ld-step">STEP {i + 1} / {steps.length}{step.type ? ' · ' + String(step.type).toUpperCase() : ''}</span>
          <div className="fes-ld-title">{step.title}</div>
        </div>
        <div className="fes-ld-body">{step.body || <SlideRenderer slide={step} />}</div>
      </div>
      <div className="fes-ld-nav">
        <button className="fes-btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>◀ 이전</button>
        <span className="fes-ld-count">{i + 1} / {steps.length}</span>
        <button className="fes-btn" disabled={last} onClick={() => setI(i + 1)}>{last ? '이 챕터 끝 ✓' : '다음 ▶'}</button>
      </div>
    </div>
  );
}

// 재사용 용어 그리드 (자료 슬라이드)
function GlossaryGrid({ intro, items }) {
  return (
    <div>
      {intro && <p className="fes-wk-quiz-intro">{intro}</p>}
      <div className="fes-wk-gloss">
        {items.map((g) => (
          <div key={g.en} className="fes-wk-gloss-item">
            <div className="fes-wk-gloss-en">{g.en}</div>
            <div className="fes-wk-gloss-ko">{g.ko}</div>
            <div className="fes-wk-gloss-d">{g.d}</div>
            {g.ex && <div className="fes-wk-gloss-ex">“{g.ex}”</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
const C3_TERMS = [
  { en: 'Load', ko: '싣다', d: '웨이퍼를 장비에 넣다.' },
  { en: 'Pump down', ko: '배기', d: '챔버를 진공으로 배기하다.' },
  { en: 'Purge', ko: '퍼지', d: '불활성 가스로 잔류 가스를 밀어내다.' },
  { en: 'Vent', ko: '벤트', d: '챔버를 대기압으로 되돌리다.' },
  { en: 'Ignite', ko: '점화', d: '플라즈마를 발생시키다.' },
  { en: 'Stop', ko: '정지', d: '운전을 멈추다.' },
];
const C4_TERMS = [
  { en: 'Alarm', ko: '알람', d: '즉시 조치가 필요한 경고.' },
  { en: 'Warning', ko: '경고', d: '주의가 필요한 알림.' },
  { en: 'Interlock', ko: '인터록', d: '안전조건 미충족 시 강제 정지.' },
  { en: 'Timeout', ko: '타임아웃', d: '정해진 시간 내 목표 미달.' },
  { en: 'Failure', ko: '고장/실패', d: '정상 동작에 실패한 상태.' },
];
const C5_TERMS = [
  { en: 'Width', ko: '선폭', d: '패턴의 폭.' },
  { en: 'Spacing', ko: '간격', d: '같은 레이어 두 패턴 사이 거리.' },
  { en: 'Enclosure', ko: '감쌈', d: '한 레이어가 다른 레이어를 감싸는 최소량.' },
  { en: 'Violation', ko: '위반', d: '규칙을 만족하지 못함.' },
  { en: 'Minimum', ko: '최소', d: '허용되는 최소값.' },
];
const C6_TERMS = [
  { en: 'Mismatch', ko: '불일치', d: '레이아웃과 회로도가 다름.' },
  { en: 'Missing device', ko: '누락 소자', d: '레이아웃에 소자가 빠짐.' },
  { en: 'Incorrect connection', ko: '잘못된 연결', d: '배선이 회로도와 다름.' },
  { en: 'Net', ko: '넷', d: '전기적으로 연결된 노드(선).' },
];

// ===== 장치 계기판 디스플레이 (LED 리드아웃 · 상태 LED · 진동 모니터) — 용어 학습용 =====
const DEV_NORMAL = [
  { label: 'PRESSURE', val: '5.0e-6', unit: 'Torr', ko: '압력' },
  { label: 'RF FORWARD', val: '600', unit: 'W', ko: '전진파(공급)' },
  { label: 'RF REFLECTED', val: '15', unit: 'W', ko: '반사파' },
  { label: 'CHUCK TEMP', val: '65', unit: '°C', ko: '척 온도' },
  { label: 'GAS FLOW', val: '50', unit: 'sccm', ko: '가스 유량' },
];
const DEV_ABNORMAL = [
  { label: 'PRESSURE', val: '2.1e-2', unit: 'Torr', ko: '압력', bad: true },
  { label: 'RF FORWARD', val: '600', unit: 'W', ko: '전진파(공급)' },
  { label: 'RF REFLECTED', val: '420', unit: 'W', ko: '반사파', bad: true },
  { label: 'CHUCK TEMP', val: '88', unit: '°C', ko: '척 온도', bad: true },
  { label: 'GAS FLOW', val: '6', unit: 'sccm', ko: '가스 유량', bad: true },
];

function VibWave({ bad }) {
  const amp = bad ? 17 : 5, n = 60, pts = [];
  for (let i = 0; i < n; i++) {
    const x = i / (n - 1) * 240;
    const y = 30 + Math.sin(i * 0.85) * amp * (bad ? (0.6 + 0.4 * Math.sin(i * 0.4)) : 1);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 240 60" className="fes-vib-svg" preserveAspectRatio="none">
      <line x1="0" y1="30" x2="240" y2="30" stroke="#16233b" strokeWidth="1" />
      <polyline points={pts.join(' ')} fill="none" stroke={bad ? C.red : C.emerald} strokeWidth="2" />
    </svg>
  );
}

function DevicePanel() {
  const [ab, setAb] = useState(false);
  const ro = ab ? DEV_ABNORMAL : DEV_NORMAL;
  const vib = ab ? { v: '9.8', s: 'HIGH', bad: true } : { v: '2.1', s: 'NORMAL' };
  const stat = ab
    ? [{ k: 'POWER', c: 'grn' }, { k: 'PLASMA', c: 'off' }, { k: 'READY', c: 'off' }, { k: 'INTERLOCK · TRIPPED', c: 'red' }]
    : [{ k: 'POWER', c: 'grn' }, { k: 'PLASMA', c: 'grn' }, { k: 'READY', c: 'grn' }, { k: 'INTERLOCK', c: 'off' }];
  return (
    <div>
      <p className="fes-wk-quiz-intro">실제 장비 계기판입니다. 각 <b>영어 라벨</b>이 무슨 값인지 익히세요. 아래 체크로 <b>비정상 상태</b>도 봅니다.</p>
      <div className="fes-wk-acr" style={{ marginBottom: 12 }}><b>RF</b> = Radio Frequency(고주파 전력) · <b>FWD</b> Forward(전진파) · <b>REFL</b> Reflected(반사파)</div>
      <div className="fes-dev-grid">
        {ro.map((r) => (
          <div key={r.label} className="fes-dev-led">
            <div className="fes-dev-led-label">{r.label}</div>
            <div className={`fes-dev-led-val ${r.bad ? 'bad' : ''}`}>{r.val}<span className="fes-dev-led-unit">{r.unit}</span></div>
            <div className="fes-dev-led-ko">{r.ko}</div>
          </div>
        ))}
      </div>
      <div className="fes-dev-row">
        <div className="fes-dev-status">
          <div className="fes-dev-sub">STATUS LED</div>
          {stat.map((s) => (<div key={s.k} className="fes-dev-stat"><span className={`fes-dev-dot ${s.c}`} />{s.k}</div>))}
        </div>
        <div className="fes-dev-vib">
          <div className="fes-dev-sub">VIBRATION MONITOR <span className="fes-dev-vibko">진동 모니터</span></div>
          <VibWave bad={vib.bad} />
          <div className={`fes-dev-vib-val ${vib.bad ? 'bad' : ''}`}>{vib.v} mm/s · {vib.s}</div>
        </div>
      </div>
      <label className="fes-inject" style={{ marginTop: 10 }}>
        <input type="checkbox" checked={ab} onChange={(e) => setAb(e.target.checked)} /> Simulate abnormal (비정상 상태 보기)
      </label>
    </div>
  );
}

// ===== 식각 장비 일러스트 (라벨 그림) =====
function ChamberIllustration() {
  return (
    <div>
      <p className="fes-wk-quiz-intro">식각 장비를 그림으로 봅니다. 각 <b>영어 라벨</b>이 어디를 가리키는지 눈에 익혀두세요.</p>
      <svg viewBox="0 0 480 300" className="fes-illus-svg">
        <defs>
          <radialGradient id="fesPlasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="480" height="300" fill="#0a0f1a" />
        {/* chamber */}
        <rect x="120" y="55" width="240" height="180" rx="12" fill="#0e1a2e" stroke={C.cyan} strokeWidth="2" />
        <text x="130" y="76" fill={C.cyan} fontSize="13" fontFamily={C.mono}>Chamber</text>
        {/* gas inlet */}
        <line x1="240" y1="22" x2="240" y2="55" stroke={C.cyan} strokeWidth="3" markerEnd="url(#fesArr)" />
        <text x="252" y="30" fill="#bfe9f5" fontSize="13" fontFamily={C.mono}>Process gas</text>
        <defs><marker id="fesArr" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><path d="M1 1L4 7L7 1" stroke={C.cyan} fill="none" strokeWidth="1.5" /></marker></defs>
        {/* RF */}
        <rect x="26" y="132" width="76" height="34" rx="6" fill="#132139" stroke={C.violet} strokeWidth="1.5" />
        <text x="64" y="153" fill={C.violet} fontSize="13" fontFamily={C.mono} textAnchor="middle">RF power</text>
        <line x1="102" y1="150" x2="185" y2="196" stroke={C.violet} strokeWidth="2" />
        {/* plasma */}
        <ellipse cx="240" cy="150" rx="92" ry="52" fill="url(#fesPlasma)" />
        {[210, 230, 250, 270, 224, 256, 240].map((x, i) => (
          <circle key={i} cx={x} cy={130 + (i % 3) * 18} r="3" fill="#c4b5fd" opacity="0.9" />
        ))}
        <text x="240" y="118" fill="#d9ccff" fontSize="13" fontFamily={C.mono} textAnchor="middle">Plasma</text>
        {/* chuck + wafer */}
        <rect x="180" y="205" width="120" height="16" rx="3" fill="#1a2a44" stroke="#2a3d5f" />
        <ellipse cx="240" cy="205" rx="66" ry="8" fill="#4f9dde" />
        <text x="240" y="240" fill="#bfe9f5" fontSize="13" fontFamily={C.mono} textAnchor="middle">Wafer on chuck</text>
        {/* pump */}
        <line x1="240" y1="235" x2="240" y2="272" stroke={C.emerald} strokeWidth="3" markerEnd="url(#fesArrG)" />
        <defs><marker id="fesArrG" markerWidth="9" markerHeight="9" refX="4" refY="7" orient="auto"><path d="M1 1L4 7L7 1" stroke={C.emerald} fill="none" strokeWidth="1.5" /></marker></defs>
        <text x="252" y="268" fill={C.emerald} fontSize="13" fontFamily={C.mono}>To pump</text>
      </svg>
      <div className="fes-illus-legend">
        <span><b>Chamber</b> 챔버</span><span><b>Process gas</b> 가스 주입</span><span><b>RF power</b> 고주파 전력</span>
        <span><b>Plasma</b> 플라즈마</span><span><b>Wafer on chuck</b> 웨이퍼/척</span><span><b>To pump</b> 배기</span>
      </div>
    </div>
  );
}

// ===== 의사소통 코너 — 외국인 엔지니어 (상황 → 예상 답변) =====
function CommTurn({ it, n }) {
  const [show, setShow] = useState(false);
  return (
    <div className="fes-comm-turn">
      <div className="fes-comm-sit"><b>상황 {n}.</b> {it.sit}</div>
      <div className="fes-comm-them">
        <span className="fes-comm-who">🧑‍🔧 Foreign Engineer</span>
        <div className="fes-comm-en">{it.q.en}</div>
        <div className="fes-comm-ko">{it.q.ko}</div>
      </div>
      <button className="fes-btn ghost" onClick={() => setShow((s) => !s)}>{show ? '예상 답변 숨기기' : '👉 이렇게 답하세요'}</button>
      {show && (
        <div className="fes-comm-you">
          <span className="fes-comm-who">🙋 You</span>
          <div className="fes-comm-en">{it.a.en}</div>
          <div className="fes-comm-ko">{it.a.ko}</div>
        </div>
      )}
    </div>
  );
}
function CommCorner({ items }) {
  return <div className="fes-comm">{items.map((it, i) => <CommTurn key={i} it={it} n={i + 1} />)}</div>;
}
const COMM_C1 = [
  { sit: '첫 출근, 외국인 엔지니어가 인사하며 담당 업무를 묻습니다.',
    q: { en: 'Welcome! What will you be working on?', ko: '환영해요! 무슨 일을 맡게 되나요?' },
    a: { en: "I'll operate the etch equipment and read the alarms.", ko: '식각 장비를 운전하고 알람을 확인합니다.' } },
  { sit: '영어가 걱정된다고 하자 조언해 줍니다.',
    q: { en: "Don't worry. Just read the screen, and ask if you're not sure.", ko: '걱정 마요. 화면을 읽고, 모르면 물어봐요.' },
    a: { en: 'Okay, I will read the manual and the HMI carefully.', ko: '네, 매뉴얼과 HMI 화면을 잘 읽겠습니다.' } },
];
const COMM_C2 = [
  { sit: '부품 이름을 확인합니다.',
    q: { en: 'Which part controls the gas flow?', ko: '어느 부품이 가스 유량을 조절하죠?' },
    a: { en: 'The MFC (Mass Flow Controller) controls the gas flow.', ko: 'MFC가 가스 유량을 조절합니다.' } },
  { sit: '배기 장치를 묻습니다.',
    q: { en: 'And what evacuates the chamber?', ko: '그럼 챔버를 배기하는 건 뭐죠?' },
    a: { en: 'The turbo pump evacuates the chamber to base pressure.', ko: '터보 펌프가 챔버를 기준 압력까지 배기합니다.' } },
];
const COMM_C3 = [
  { sit: '운전을 시작하려는데 외국인 엔지니어가 상태를 묻습니다.',
    q: { en: 'Is the chamber ready? Did you reach base pressure?', ko: '챔버 준비됐어요? 기준 압력에 도달했나요?' },
    a: { en: 'Yes, base pressure is reached. The chamber is ready.', ko: '네, 기준 압력에 도달했습니다. 챔버 준비됐습니다.' } },
  { sit: '다음 단계를 확인합니다.',
    q: { en: 'Good. Please start the gas and check the flow.', ko: '좋아요. 가스를 시작하고 유량을 확인해 주세요.' },
    a: { en: 'Okay. The gas flow is 50 sccm and stable.', ko: '알겠습니다. 가스 유량 50 sccm, 안정적입니다.' } },
];
const COMM_C4 = [
  { sit: '알람이 떠서 상황을 공유합니다.',
    q: { en: 'What alarm is on the screen?', ko: '화면에 무슨 알람이 떴어요?' },
    a: { en: 'RF-204, high reflected power. The plasma failed to ignite.', ko: 'RF-204, 반사파 높음. 플라즈마 점화 실패입니다.' } },
  { sit: '조치를 묻습니다.',
    q: { en: 'What will you do first?', ko: '먼저 뭘 할 거예요?' },
    a: { en: "I'll check the pressure and re-tune the matching network.", ko: '압력을 확인하고 매칭을 다시 맞추겠습니다.' } },
];
const COMM_C5 = [
  { sit: 'DRC 결과를 공유합니다.',
    q: { en: 'Did the layout pass DRC?', ko: '레이아웃이 DRC를 통과했어요?' },
    a: { en: 'No, there is a spacing violation on METAL1.', ko: '아뇨, METAL1에 간격 위반이 있습니다.' } },
  { sit: '수정 방법을 묻습니다.',
    q: { en: 'How will you fix it?', ko: '어떻게 고칠 건가요?' },
    a: { en: "I'll increase the spacing to meet the minimum.", ko: '최소 간격을 만족하도록 간격을 넓히겠습니다.' } },
];
const COMM_C6 = [
  { sit: 'LVS 결과를 공유합니다.',
    q: { en: 'Does the layout match the schematic?', ko: '레이아웃이 회로도와 일치해요?' },
    a: { en: 'No, the NMOS device is missing in the layout.', ko: '아뇨, 레이아웃에 NMOS 소자가 빠졌습니다.' } },
  { sit: '조치를 요청합니다.',
    q: { en: 'Please add it and re-run LVS.', ko: '추가하고 LVS를 다시 돌려요.' },
    a: { en: 'Okay, I will place the device and re-run LVS.', ko: '네, 소자를 배치하고 LVS를 다시 돌리겠습니다.' } },
];
const COMM_C7 = [
  { sit: '종합 결과를 보고합니다.',
    q: { en: 'Can you summarize the problem?', ko: '문제를 요약해 줄래요?' },
    a: { en: 'The line width was too narrow due to unstable pressure and RF.', ko: '압력·RF 불안정으로 선폭이 너무 좁았습니다.' } },
  { sit: '조치 후 결과를 묻습니다.',
    q: { en: 'And the result after the fix?', ko: '조치 후 결과는요?' },
    a: { en: 'The width returned to target, and DRC is clean now.', ko: '선폭이 목표로 돌아왔고, 이제 DRC는 깨끗합니다.' } },
];

// ===== PM 점검표 (7주) =====
const PM_TASKS = [
  { en: 'Inspect the O-ring seal', ko: 'O-링 씰 점검' },
  { en: 'Clean the chamber wall', ko: '챔버 벽 세정' },
  { en: 'Replace the pump oil', ko: '펌프 오일 교체' },
  { en: 'Calibrate the MFC and gauge', ko: 'MFC·게이지 교정' },
  { en: 'Tighten the loose bolts', ko: '풀린 볼트 조임' },
];
function PMChecklist() {
  const [done, setDone] = useState({});
  const n = Object.values(done).filter(Boolean).length;
  return (
    <div>
      <p className="fes-wk-quiz-intro">유지보수 <b>점검표(checklist)</b>입니다. 항목을 읽고 완료하면 체크하세요.</p>
      <div className="fes-pm">
        {PM_TASKS.map((t, i) => (
          <label key={i} className={`fes-pm-item ${done[i] ? 'on' : ''}`}>
            <input type="checkbox" checked={!!done[i]} onChange={(e) => setDone((d) => ({ ...d, [i]: e.target.checked }))} />
            <div><div className="fes-pm-en">{t.en}</div><div className="fes-pm-ko">{t.ko}</div></div>
          </label>
        ))}
      </div>
      <div className="fes-check-row"><span className={`fes-score ${n === PM_TASKS.length ? 'ok' : 'mid'}`}>{n}/{PM_TASKS.length} 완료</span></div>
    </div>
  );
}

// ===== 데이터 주도 슬라이드 렌더러 (에이전트가 낸 typed slide 를 그대로 렌더) =====
function rich(text) {
  if (text == null) return null;
  return String(text).split(/\*\*/).map((s, i) => (i % 2 ? <b key={i}>{s}</b> : <React.Fragment key={i}>{s}</React.Fragment>));
}
function ArtImage({ which, cap }) {
  if (!ART[which]) return null;
  return (
    <figure className="fes-art">
      <img src={ART[which]} alt={cap || which} className="fes-art-img" />
      {cap && <figcaption className="fes-art-cap">{cap}</figcaption>}
    </figure>
  );
}
const SIM_REGISTRY = {
  equipment: () => <EquipmentHMI />,
  chamberArt: () => <ArtImage which="chamber" cap="Plasma etch chamber — cross-section (도해). 각 부품의 영어 이름은 번호 라벨 참고." />,
  alarm: () => <AlarmLab />,
  drc: () => <><ArtImage which="drc" cap="Design Rule Check — 레이아웃 상면도(top view). 통과(PASS)와 위반(VIOLATION) 예시. 아래에서 직접 판정 연습." /><DrcLab /></>,
  lvs: () => <><ArtImage which="lvs" cap="Layout Versus Schematic — 회로도(reference)와 레이아웃(extracted) 넷리스트 비교. 아래에서 직접 판정 연습." /><LvsLab /></>,
  report: () => <ReportLab />,
  partDiagram: () => <PartDiagram parts={W2_PARTS} />,
  devicePanel: () => <DevicePanel />,
  chamber: () => <ArtImage which="chamber" cap="Plasma etch chamber — cross-section (도해). 각 부품의 영어 이름은 번호 라벨 참고." />,
  layer: () => <ArtImage which="layer" cap="MOSFET device cross-section — 공정 레이어(도해). 각 레이어의 영어 이름은 번호 라벨 참고." />,
  pm: () => <PMChecklist />,
};
function SlideRenderer({ slide }) {
  switch (slide.type) {
    case 'story':
      return <div className="fes-wk-story"><div className="fes-wk-story-ic">{slide.icon || '🏭'}</div><div>{rich(slide.text)}</div></div>;
    case 'read':
      return (
        <div className="fes-th">
          {slide.intro && <div className="fes-th-lead">{rich(slide.intro)}</div>}
          <ul className="fes-th-list">
            {(slide.paras || []).map((p, i) => <li key={i} className="fes-th-point"><span className="fes-th-mk" />{rich(p)}</li>)}
          </ul>
        </div>
      );
    case 'acr':
      return <div>{slide.intro && <p className="fes-wk-quiz-intro">{slide.intro}</p>}{(slide.items || []).map((a, i) => <div key={i} className="fes-wk-acr"><b>{a.ab} = {a.full}</b> — {a.ko}</div>)}</div>;
    case 'glossary':
      return <GlossaryGrid intro={slide.intro} items={slide.items || []} />;
    case 'quiz':
      return <QuizBlock intro={slide.intro} questions={slide.questions || []} />;
    case 'manual':
      return <div className="fes-wk-manual"><div className="fes-wk-manual-h">{slide.mtitle || 'MANUAL'}</div>{(slide.paras || []).map((p, i) => <p key={i}>{rich(p)}</p>)}</div>;
    case 'comm':
      return <CommCorner items={slide.items || []} />;
    case 'sim':
      return <div>{slide.intro && <p className="fes-wk-hint" style={{ margin: '0 0 12px' }}>{rich(slide.intro)}</p>}{(SIM_REGISTRY[slide.which] || (() => <div className="fes-dim">[{slide.which}]</div>))()}</div>;
    case 'wrap':
      return <div><ul className="fes-cb-summary">{(slide.points || []).map((p, i) => <li key={i}>{rich(p)}</li>)}</ul>{slide.done && <div className="fes-cb-complete">{rich(slide.done)}</div>}</div>;
    default:
      return slide.body || null;
  }
}

// ============ 챕터 데이터 (책의 목차 · 이 배열만 갈아끼우면 다른 책이 된다) ============
const CHAPTERS = CONTENT_CHAPTERS;

// 챕터 책 리더 — 목차(진도·성취 표시) + 슬라이드 뷰어
function ChapterBook() {
  const available = CHAPTERS.filter((c) => !c.locked);
  const [done, setDone] = useState(() => {
    try { return new Set(JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || '[]')); } catch (e) { return new Set(); }
  });
  const [sel, setSel] = useState(CHAPTERS[0].id);
  const markDone = useCallback((id) => {
    setDone((d) => {
      if (d.has(id)) return d;
      const nd = new Set(d); nd.add(id);
      try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify([...nd])); } catch (e) { /* ignore */ }
      return nd;
    });
  }, []);
  const cur = CHAPTERS.find((c) => c.id === sel);
  const curIdx = CHAPTERS.indexOf(cur);
  const pct = Math.round(available.filter((c) => done.has(c.id)).length / available.length * 100);

  return (
    <div>
      <div className="fes-cb-progress">
        <span>학습 진도</span>
        <div className="fes-cb-bar"><div style={{ width: `${pct}%` }} /></div>
        <span className="fes-mono">{pct}%</span>
      </div>
      <div className="fes-cb-rail">
        {CHAPTERS.map((c, idx) => (
          <button key={c.id} disabled={c.locked} onClick={() => !c.locked && setSel(c.id)}
            className={`fes-cb-chip ${sel === c.id ? 'on' : ''} ${c.locked ? 'off' : ''} ${done.has(c.id) ? 'done' : ''}`} title={c.title}>
            <span className="fes-cb-chip-n">CH {idx + 1}</span>
            <span className="fes-cb-chip-t">{c.title}</span>
            {done.has(c.id) && <span className="fes-cb-check">✓</span>}
            {c.locked && <span className="fes-cb-lock">🔒</span>}
          </button>
        ))}
      </div>
      <div className="fes-cb-head">
        <div className="fes-cb-head-t">Chapter {curIdx + 1} · {cur.title}</div>
        {done.has(cur.id) && <span className="fes-cb-done-tag">완료 ✓</span>}
      </div>
      {cur.locked
        ? <div className="fes-wk-placeholder">이 챕터는 아직 <b>준비 중</b>입니다. 현재 <b>Chapter 1~2</b>가 완성되어 있어요.</div>
        : <LessonDeck key={cur.id} chapterId={cur.id} steps={cur.slides} onReachEnd={markDone} />}
    </div>
  );
}

/* =========================================================================
 * 개념 ⓪  Course Map — 강의자용 한눈에 보기 콘솔 (주차 대신 구조 중심)
 * ====================================================================== */

// Course Map = 정적 '책 안내'. 클릭 네비 없음 — 학습은 Chapters 탭에서.
const CM_PART_EQUIP = [
  { ch: 'CH 2', t: '장비 구성요소', d: 'chamber·pump·valve·MFC·RF (영문 매뉴얼)' },
  { ch: 'CH 3', t: '운전 절차', d: 'load·evacuate·purge·vent (작업 지시문)' },
  { ch: 'CH 4', t: '진공·가스 로그', d: 'set point vs actual value, sccm' },
  { ch: 'CH 5', t: '플라즈마 장비', d: 'RF power·matching·reflected power' },
  { ch: 'CH 6', t: '알람과 조치', d: 'alarm·interlock·timeout·failure' },
  { ch: 'CH 7', t: '유지보수(PM)', d: 'inspect·clean·replace·calibrate' },
];
const CM_PART_DESIGN = [
  { ch: 'CH 9', t: 'Layer 용어', d: 'well·active·poly·contact·metal' },
  { ch: 'CH 10', t: 'Design Rule', d: 'width·spacing·overlap·enclosure' },
  { ch: 'CH 11', t: '패턴 배치', d: 'layer 배치 · 선폭 · 간격' },
  { ch: 'CH 12', t: 'DRC 오류', d: 'DRC (Design Rule Check) 오류 해석' },
  { ch: 'CH 13', t: 'LVS 검증', d: 'LVS (Layout Versus Schematic) 비교' },
];

function CourseMap() {
  return (
    <div className="fes-cm">
      <div className="fes-cm-guide-note">📖 이 화면은 <b>책 구성 안내</b>입니다. 실제 학습은 위 <b>Chapters</b> 탭에서 하세요.</div>

      <div className="fes-cm-what">
        <b>무엇을 배우나</b> — 실제 현장의 <span className="fes-cm-hl">영어 매뉴얼</span>, <span className="fes-cm-hl">영어 작업 지시문</span>, 그리고 <span className="fes-cm-hl">HMI 화면의 영어 GUI·메시지</span>를 읽고 판단하는 힘.
      </div>

      {/* 4단계 방식 */}
      <div className="fes-cm-loop">
        {['Read manual', 'Operate', 'Interpret log/error', 'Report'].map((s, i) => (
          <React.Fragment key={s}>
            <div className="fes-cm-loop-chip"><span>{i + 1}</span>{s}</div>
            {i < 3 && <span className="fes-cm-loop-ar">→</span>}
          </React.Fragment>
        ))}
        <span className="fes-cm-loop-tag">매 챕터 반복</span>
      </div>

      {/* 구성: Day1 + 장비 파트 / 디자인 파트 / 종합 */}
      <div className="fes-cm-day1">CH 1 · Day 1 — 오리엔테이션 (두루두루 훑기)</div>
      <div className="fes-cm-parts">
        <div className="fes-cm-part">
          <div className="fes-cm-part-h fes-a">장비 파트 · Equipment</div>
          {CM_PART_EQUIP.map((c) => (
            <div key={c.ch} className="fes-cm-part-row"><span className="fes-cm-part-ch">{c.ch}</span><div><b>{c.t}</b><span>{c.d}</span></div></div>
          ))}
        </div>
        <div className="fes-cm-part">
          <div className="fes-cm-part-h fes-b">디자인 파트 · Design</div>
          {CM_PART_DESIGN.map((c) => (
            <div key={c.ch} className="fes-cm-part-row"><span className="fes-cm-part-ch">{c.ch}</span><div><b>{c.t}</b><span>{c.d}</span></div></div>
          ))}
        </div>
      </div>
      <div className="fes-cm-part fes-cm-part-full">
        <div className="fes-cm-part-h fes-c">종합 · 평가</div>
        <div className="fes-cm-part-row"><span className="fes-cm-part-ch">CH 14</span><div><b>종합 현장 보고</b><span>장비 이상 → 식각 비정상 → DRC 오류 → 영문 보고서까지 한 흐름</span></div></div>
        <div className="fes-cm-part-row"><span className="fes-cm-part-ch">CH 8·15</span><div><b>중간 점검 · 종합 점검</b><span>CH 8: 장비·운전·로그·알람 / CH 15: + Layer·DRC·LVS 종합</span></div></div>
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
    overview: <CourseMap />,
    chapters: <ChapterBook />,
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
.fes-ld-slide{background:linear-gradient(180deg,#0f1524,#0a0e18);border:1px solid ${C.line};border-radius:14px;overflow:hidden;min-height:min(58vh,500px);display:flex;flex-direction:column;box-shadow:0 8px 30px #0006}
.fes-ld-head{position:relative;background:linear-gradient(90deg,${C.elec}22,${C.elec}08 60%,transparent);border-bottom:1px solid ${C.line};border-left:4px solid ${C.elec};padding:15px 24px}
.fes-ld-head:after{content:'';position:absolute;right:20px;top:16px;width:34px;height:34px;border-radius:9px;background:radial-gradient(circle at 30% 30%,${C.neon}55,${C.elec}22);opacity:.5}
.fes-ld-step{font-family:${C.mono};font-size:11px;letter-spacing:1.5px;color:${C.neon};font-weight:700}
.fes-ld-title{font-size:23px;font-weight:800;color:#fff;margin-top:5px;letter-spacing:-.2px;text-wrap:balance;max-width:90%}
.fes-ld-body{font-size:15px;line-height:1.75;padding:22px 26px 24px;flex:1;display:flex;flex-direction:column;justify-content:center}

/* 이론(PPT) 슬라이드 */
.fes-th-lead{font-size:16px;line-height:1.7;color:#eaf1ff;border-left:3px solid ${C.neon};background:${C.neon}0e;padding:11px 15px;border-radius:0 9px 9px 0;margin-bottom:15px}
.fes-th-lead b{color:${C.neon}}
.fes-th-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.fes-th-point{position:relative;background:${C.panel};border:1px solid ${C.line2};border-radius:11px;padding:13px 15px 13px 42px;font-size:14.5px;line-height:1.65;color:${C.text}}
.fes-th-point b{color:${C.neon};font-weight:700}
.fes-th-mk{position:absolute;left:16px;top:17px;width:10px;height:10px;background:${C.elec};transform:rotate(45deg);border-radius:2px;box-shadow:0 0 8px ${C.elec}88}
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
.fes-wk-diag{display:flex;flex-direction:column;gap:12px}
.fes-pd-wrap{display:grid;grid-template-columns:1.55fr 1fr;gap:14px;align-items:start}
@media(max-width:640px){.fes-pd-wrap{grid-template-columns:1fr}}
.fes-pd-legend{display:flex;flex-direction:column;gap:7px}
.fes-pd-leg{display:flex;align-items:center;gap:11px;text-align:left;background:${C.panel};border:1px solid ${C.line2};border-radius:9px;padding:8px 11px;cursor:pointer;transition:.12s}
.fes-pd-leg:hover{border-color:${C.neon}88}
.fes-pd-leg.on{border-color:${C.neon};background:${C.neon}14}
.fes-pd-num{width:22px;height:22px;border-radius:50%;background:${C.elec};color:#fff;font-family:${C.mono};font-size:12px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:none}
.fes-pd-leg b{color:#e8f6ff;font-size:13px}
.fes-pd-ko{display:block;color:${C.dim};font-size:11px;margin-top:1px}
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
.fes-wk-gloss-ex{font-family:${C.mono};font-size:11px;color:${C.emerald};margin-top:6px;font-style:italic}

/* Chapter book */
.fes-cb-progress{display:flex;align-items:center;gap:10px;font-size:12px;color:${C.dim};margin-bottom:12px}
.fes-cb-bar{flex:1;height:8px;background:#0a1526;border-radius:20px;overflow:hidden}
.fes-cb-bar>div{height:100%;background:linear-gradient(90deg,${C.cyan},${C.emerald});transition:width .4s}
.fes-cb-rail{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-bottom:14px}
.fes-cb-chip{position:relative;display:flex;flex-direction:column;gap:2px;text-align:left;background:${C.panel};border:1px solid ${C.line2};color:${C.text};border-radius:10px;padding:9px 11px;cursor:pointer;transition:.14s}
.fes-cb-chip:hover:not(:disabled){border-color:${C.cyan}}
.fes-cb-chip.on{background:${C.cyan}18;border-color:${C.cyan}}
.fes-cb-chip.off{opacity:.45;cursor:not-allowed}
.fes-cb-chip.done{border-color:${C.emerald}66}
.fes-cb-chip-n{font-family:${C.mono};font-size:10px;letter-spacing:1px;color:${C.cyan}}
.fes-cb-chip.off .fes-cb-chip-n{color:${C.dim}}
.fes-cb-chip-t{font-size:12.5px;font-weight:600;color:#e8eefc}
.fes-cb-chip.off .fes-cb-chip-t{color:${C.dim}}
.fes-cb-check{position:absolute;top:8px;right:9px;color:${C.emerald};font-weight:800;font-size:13px}
.fes-cb-lock{position:absolute;top:8px;right:9px;font-size:11px}
.fes-cb-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.fes-cb-head-t{font-size:16px;font-weight:800;color:#e8eefc}
.fes-cb-done-tag{font-size:10.5px;color:${C.emerald};border:1px solid ${C.emerald}55;border-radius:20px;padding:3px 10px}
.fes-cb-summary{margin:0 0 14px;padding-left:20px;font-size:14px;line-height:2}
.fes-cb-summary b{color:${C.cyan}}
.fes-cb-complete{background:${C.emerald}12;border:1px solid ${C.emerald}44;border-radius:10px;padding:12px 14px;font-size:13px;color:#d7ffe9}
.fes-cb-complete b{color:${C.emerald}}
.fes-wr-prompt{font-size:14.5px;line-height:1.7;color:${C.text};margin-bottom:10px}
.fes-wr-prompt b{color:${C.cyan}}
.fes-wr-en{display:inline-block;margin-top:6px;font-family:${C.mono};font-size:14px;color:#bfe9f5;background:#0b1424;border:1px solid ${C.line2};border-radius:6px;padding:6px 10px}
.fes-wr-ko{display:inline-block;margin-top:6px;font-size:15px;color:#e8eefc;background:#0b1424;border:1px solid ${C.line2};border-radius:6px;padding:6px 10px}

/* 현장 둘러보기 (tour) */
.fes-tour{display:flex;flex-direction:column;gap:8px}
.fes-tour-item{display:flex;align-items:center;gap:12px;background:${C.panel};border:1px solid ${C.line2};border-radius:10px;padding:11px 14px}
.fes-tour-ic{font-size:24px;flex:none}
.fes-tour-area{font-size:13px;font-weight:700;color:#e8eefc}
.fes-tour-en{font-family:${C.mono};font-size:12.5px;color:#bfe9f5;margin:2px 0}
.fes-tour-ko{font-size:11.5px;color:${C.dim}}

/* 대화문 (dialogue) */
.fes-dlg{display:flex;flex-direction:column;gap:10px}
.fes-dlg-row{display:flex;flex-direction:column;max-width:80%}
.fes-dlg-row.me{align-self:flex-end;align-items:flex-end}
.fes-dlg-who{font-family:${C.mono};font-size:10.5px;color:${C.dim};margin-bottom:3px;padding:0 4px}
.fes-dlg-bubble{background:${C.panel2};border:1px solid ${C.line2};border-radius:12px 12px 12px 4px;padding:10px 13px}
.fes-dlg-row.me .fes-dlg-bubble{background:${C.cyan}14;border-color:${C.cyan}44;border-radius:12px 12px 4px 12px}
.fes-dlg-en{font-size:14px;color:#e8f6ff}
.fes-dlg-ko{font-size:11.5px;color:${C.dim};margin-top:3px}

/* 영어 소스 3곳 (매뉴얼/지시문/HMI) */
.fes-src{display:flex;flex-direction:column;gap:10px}
.fes-src-item{background:#08101f;border:1px solid ${C.line2};border-left:3px solid ${C.cyan};border-radius:10px;padding:12px 15px}
.fes-src-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.fes-src-ic{font-size:18px}
.fes-src-k{font-family:${C.mono};font-size:12px;color:${C.cyan};font-weight:700;letter-spacing:.4px}
.fes-src-en{font-size:15px;color:#e8f6ff;line-height:1.5}
.fes-src-ko{font-size:11.5px;color:${C.dim};margin-top:4px}

/* Course Map 정적 안내 */
.fes-cm-guide-note{background:${C.cyan}12;border:1px solid ${C.cyan}33;border-radius:9px;padding:10px 13px;font-size:12.5px;color:#bfe9f5;margin-bottom:12px}
.fes-cm-guide-note b{color:#fff}
.fes-cm-what{font-size:13.5px;line-height:1.7;color:${C.text};margin-bottom:14px}
.fes-cm-day1{background:${C.panel};border:1px solid ${C.line2};border-radius:9px;padding:10px 14px;font-size:13.5px;font-weight:700;color:#e8eefc;margin:14px 0}
.fes-cm-parts{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:600px){.fes-cm-parts{grid-template-columns:1fr}}
.fes-cm-part{background:${C.panel};border:1px solid ${C.line2};border-radius:12px;padding:14px}
.fes-cm-part-full{margin-top:14px}
.fes-cm-part-h{font-family:${C.mono};font-size:12px;font-weight:700;letter-spacing:.4px;padding:7px 11px;border-radius:8px;margin-bottom:10px}
.fes-cm-part-h.fes-a{background:${C.cyan}14;color:${C.cyan};border:1px solid ${C.cyan}40}
.fes-cm-part-h.fes-b{background:${C.violet}14;color:${C.violet};border:1px solid ${C.violet}40}
.fes-cm-part-h.fes-c{background:${C.emerald}14;color:${C.emerald};border:1px solid ${C.emerald}40}
.fes-cm-part-row{display:flex;gap:11px;align-items:flex-start;padding:8px 4px;border-top:1px solid ${C.line}}
.fes-cm-part-row:first-of-type{border-top:none}
.fes-cm-part-ch{font-family:${C.mono};font-size:11px;color:${C.amber};border:1px solid ${C.amber}44;border-radius:6px;padding:2px 7px;flex:none;margin-top:1px}
.fes-cm-part-row div{display:flex;flex-direction:column}
.fes-cm-part-row b{font-size:13.5px;color:#e8eefc}
.fes-cm-part-row span{font-size:11.5px;color:${C.dim};margin-top:1px}

/* 장치 계기판 디스플레이 */
.fes-dev-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.fes-dev-led{background:#04070d;border:1px solid ${C.line2};border-radius:9px;padding:10px 12px}
.fes-dev-led-label{font-family:${C.mono};font-size:10px;letter-spacing:1px;color:${C.dim}}
.fes-dev-led-val{font-family:${C.mono};font-size:24px;font-weight:700;color:${C.emerald};text-shadow:0 0 8px ${C.emerald}66;margin-top:3px;line-height:1}
.fes-dev-led-val.bad{color:${C.red};text-shadow:0 0 8px ${C.red}66;animation:fesBlink 1s infinite}
.fes-dev-led-unit{font-size:11px;color:${C.dim};margin-left:4px;text-shadow:none;font-weight:400}
.fes-dev-led-ko{font-size:10.5px;color:${C.dim};margin-top:4px}
.fes-dev-row{display:grid;grid-template-columns:1fr 1.3fr;gap:10px;margin-top:10px}
@media(max-width:560px){.fes-dev-row{grid-template-columns:1fr}}
.fes-dev-status,.fes-dev-vib{background:#04070d;border:1px solid ${C.line2};border-radius:9px;padding:11px 13px}
.fes-dev-sub{font-family:${C.mono};font-size:10px;letter-spacing:1px;color:${C.cyan};margin-bottom:8px}
.fes-dev-vibko{color:${C.dim};letter-spacing:0}
.fes-dev-stat{display:flex;align-items:center;gap:8px;font-family:${C.mono};font-size:12px;color:${C.text};padding:3px 0}
.fes-dev-dot{width:10px;height:10px;border-radius:50%;flex:none}
.fes-dev-dot.grn{background:${C.emerald};box-shadow:0 0 6px ${C.emerald}}
.fes-dev-dot.red{background:${C.red};box-shadow:0 0 6px ${C.red};animation:fesBlink 1s infinite}
.fes-dev-dot.off{background:#28344a}
.fes-vib-svg{width:100%;height:56px;display:block;background:#060c17;border-radius:6px}
.fes-dev-vib-val{font-family:${C.mono};font-size:13px;color:${C.emerald};margin-top:6px}
.fes-dev-vib-val.bad{color:${C.red}}

/* 의사소통 코너 */
.fes-comm{display:flex;flex-direction:column;gap:14px}
.fes-comm-turn{background:${C.panel};border:1px solid ${C.line2};border-radius:12px;padding:14px}
.fes-comm-sit{font-size:12.5px;color:${C.amber};margin-bottom:10px}
.fes-comm-sit b{color:${C.amber}}
.fes-comm-who{font-family:${C.mono};font-size:10.5px;color:${C.dim};display:block;margin-bottom:4px}
.fes-comm-them{background:${C.panel2};border:1px solid ${C.line2};border-radius:10px 10px 10px 3px;padding:10px 13px;margin-bottom:10px}
.fes-comm-you{background:${C.cyan}12;border:1px solid ${C.cyan}44;border-radius:10px 10px 3px 10px;padding:10px 13px;margin-top:10px}
.fes-comm-en{font-size:14.5px;color:#e8f6ff;line-height:1.5}
.fes-comm-ko{font-size:11.5px;color:${C.dim};margin-top:3px}

/* 약어 설명 박스 */
.fes-wk-acr{background:${C.violet}12;border:1px solid ${C.violet}44;border-radius:8px;padding:9px 12px;font-size:12.5px;color:#d9ccff;line-height:1.6;margin-bottom:12px}
.fes-wk-acr b{color:${C.violet};font-family:${C.mono}}
.fes-illus-svg{width:100%;border:1px solid ${C.line};border-radius:10px;display:block;background:#0a0f1a;margin-top:4px}
.fes-art{margin:0}
.fes-art-img{width:100%;display:block;border-radius:12px;border:1px solid ${C.line};box-shadow:0 6px 24px #0007}
.fes-art-cap{font-size:12px;color:${C.dim};margin-top:9px;text-align:center}
.fes-illus-legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px;font-size:11.5px;color:${C.dim}}
.fes-illus-legend b{color:#bfe9f5;font-family:${C.mono}}
.fes-wk-partinfo-role{font-size:12.5px;color:${C.emerald};margin-top:8px}
.fes-pm{display:flex;flex-direction:column;gap:8px}
.fes-pm-item{display:flex;align-items:center;gap:11px;background:${C.panel};border:1px solid ${C.line2};border-radius:9px;padding:11px 13px;cursor:pointer}
.fes-pm-item.on{border-color:${C.emerald};background:${C.emerald}12}
.fes-pm-item input{accent-color:${C.emerald};width:17px;height:17px;flex:none}
.fes-pm-en{font-size:14px;color:#e8f6ff}
.fes-pm-ko{font-size:11.5px;color:${C.dim};margin-top:2px}
`}</style>
  );
}
