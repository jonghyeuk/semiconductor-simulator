import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Simple icon components
const PlayIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
  </svg>
);

const CleaningSimulator = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'theory');
  
  // 세정 공정 상태들
  const [wetCleaningParams, setWetCleaningParams] = useState({
    solution: 'SC1',
    concentration: 5,
    temperature: 70,
    time: 10
  });
  
  const [dryCleaningParams, setDryCleaningParams] = useState({
    method: 'plasma',
    power: 300,
    pressure: 0.1,
    gas: 'O2'
  });
  
  const [ultrasonicParams, setUltrasonicParams] = useState({
    frequency: 40,
    power: 100,
    time: 5
  });
  
  const [contaminationLevel, setContaminationLevel] = useState({
    particles: 80,
    organics: 60,
    metals: 40
  });

  // Theory opening animation states
  const [theoryStep, setTheoryStep] = useState(0);
  const [isTheoryPlaying, setIsTheoryPlaying] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showDetailedTheory, setShowDetailedTheory] = useState(false);
  const storyContentRef = useRef(null);

  // 탭 정의
  const tabs = [
    { id: 'theory', name: '이론', icon: '🎬' },
    { id: 'overview', name: '세정 공정 개요', icon: '🔄' },
    { id: 'wet-cleaning', name: '습식 세정', icon: '💧' },
    { id: 'dry-cleaning', name: '건식 세정', icon: '⚡' },
    { id: 'ultrasonic', name: '초음파 세정', icon: '🌊' },
    { id: 'quiz', name: '세정 평가', icon: '📝' }
  ];

  // 산화막 제거 효율 계산 (세정 효율의 핵심 지표)
  const calculateOxideRemovalEfficiency = (method, params) => {
    switch(method) {
      case 'wet':
        // 습식 세정에서 산화막 제거는 주로 HF 기반 용액의 특성에 의존
        const tempFactor = (params.temperature - 25) / 75;
        const concFactor = params.concentration / 10;
        const timeFactor = Math.min(params.time / 15, 1);
        
        // BOE의 경우 산화막 제거에 특화
        const solutionFactor = params.solution === 'BOE' ? 1.2 : 
                              params.solution === 'SC1' ? 0.3 : 
                              params.solution === 'SC2' ? 0.2 : 0.8;
        
        return Math.min(98, 20 + tempFactor * 25 + concFactor * 30 + timeFactor * 20 + solutionFactor * 15);
      
      case 'dry':
        const powerFactor = params.power / 500;
        const pressureFactor = (0.5 - params.pressure) / 0.4;
        return Math.min(85, 35 + powerFactor * 30 + pressureFactor * 20);
      
      case 'ultrasonic':
        // 초음파는 물리적 제거에 특화, 산화막 제거 효율은 제한적
        const freqFactor = Math.abs(params.frequency - 40) / 40;
        const powerUsFactor = params.power / 150;
        return Math.min(60, 30 + (1 - freqFactor) * 15 + powerUsFactor * 15);
      
      default:
        return 0;
    }
  };

  // 웨이퍼 SVG 컴포넌트 (기본 오염 상태 표시용)
  const WaferVisualization = ({ contaminationLevel, cleaningMethod = null }) => {
    const particleCount = Math.floor(contaminationLevel.particles / 10);
    const organicOpacity = contaminationLevel.organics / 100;
    const metalOpacity = contaminationLevel.metals / 100;
    
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
          {/* 웨이퍼 기본 원형 */}
          <circle cx="150" cy="150" r="140" fill="#e5e5e5" stroke="#999" strokeWidth="2"/>
          
          {/* 오염물질 표시 */}
          {/* 유기물 오염 (반투명 갈색 레이어) */}
          <circle cx="150" cy="150" r="135" fill={`rgba(139, 69, 19, ${organicOpacity * 0.3})`} />
          
          {/* 금속 오염 (반투명 주황색 레이어) */}
          <circle cx="150" cy="150" r="130" fill={`rgba(255, 140, 0, ${metalOpacity * 0.3})`} />
          
          {/* 입자 오염 (작은 점들) */}
          {Array.from({ length: particleCount }, (_, i) => {
            const angle = (i / particleCount) * 2 * Math.PI;
            const radius = 40 + (i % 3) * 30;
            const x = 150 + Math.cos(angle) * radius;
            const y = 150 + Math.sin(angle) * radius;
            return (
              <circle key={i} cx={x} cy={y} r="3" fill="#8b4513" opacity="0.7" />
            );
          })}
          
          {/* 세정 효과 표시 */}
          {cleaningMethod && (
            <text x="150" y="280" textAnchor="middle" className="text-sm font-medium">
              {cleaningMethod} 세정 진행 중...
            </text>
          )}
          
          {/* 웨이퍼 중심 마크 */}
          <circle cx="150" cy="150" r="3" fill="#666" />
          <text x="150" y="160" textAnchor="middle" className="text-xs">Si</text>
        </svg>
      </div>
    );
  };

  // 웨이퍼 단면 산화막 제거 시각화 컴포넌트
  const WaferCrossSectionVisualization = ({ solution, isProcessing = false, removalEfficiency = 0 }) => {
    const solutionColors = {
      'SC1': '#e3f2fd',    // 연한 파란색 (암모니아 기반)
      'SC2': '#fff3e0',    // 연한 주황색 (염산 기반)  
      'SPM': '#f3e5e8',    // 연한 분홍색 (황산 기반)
      'BOE': '#e8f5e8'     // 연한 녹색 (불산 기반)
    };
    
    // 세정액별 타겟 레이어 정보
    const solutionTargets = {
      'SC1': { 
        layerColor: '#8b4513', 
        layerName: '입자 오염층',
        initialThickness: 6,
        reactionFormula: 'NH₄OH + H₂O₂ → 입자 현탁 및 제거',
        unit: '개/cm²'
      },
      'SC2': { 
        layerColor: '#ff8c00', 
        layerName: '금속이온막',
        initialThickness: 5,
        reactionFormula: 'HCl + 금속이온 → 수용성 염화물 형성',
        unit: 'at/cm²'
      },
      'SPM': { 
        layerColor: '#9b4444', 
        layerName: '유기물막',
        initialThickness: 7,
        reactionFormula: 'H₂SO₄ + H₂O₂ + 유기물 → CO₂ + H₂O (완전 산화)',
        unit: 'μg/cm²'
      },
      'BOE': { 
        layerColor: '#4169E1', 
        layerName: 'SiO₂ 산화막',
        initialThickness: 8,
        reactionFormula: 'SiO₂ + 6HF → H₂SiF₆ + 2H₂O (산화막 용해 반응)',
        unit: 'Å'
      }
    };
    
    const targetInfo = solutionTargets[solution];
    const initialThickness = targetInfo.initialThickness;
    // 제거 효율에 따른 현재 층 두께
    const currentThickness = initialThickness * (1 - removalEfficiency / 100);
    
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-center mb-3">
          <h5 className="font-semibold text-gray-700">웨이퍼 단면도 - {targetInfo.layerName} 제거 과정</h5>
          <div className="text-sm text-gray-600">
            {solution === 'BOE' ? (
              <>자연산화막 두께: ~500Å → 현재: ~{Math.round(500 * (1 - removalEfficiency / 100))}Å</>
            ) : (
              <>초기 오염도: 100% → 현재: {(100 - removalEfficiency).toFixed(1)}%</>
            )}
          </div>
        </div>
        
        <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
          <defs>
            {/* 세정액 그라디언트 (글래스 효과) */}
            <linearGradient id={`bathGrad-${solution}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={solutionColors[solution]} stopOpacity="0.55"/>
              <stop offset="40%" stopColor={solutionColors[solution]} stopOpacity="0.95"/>
              <stop offset="100%" stopColor={solutionColors[solution]} stopOpacity="0.78"/>
            </linearGradient>
            {/* 실리콘 기판 그라디언트 */}
            <linearGradient id="siGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8c8c8c"/>
              <stop offset="55%" stopColor="#555555"/>
              <stop offset="100%" stopColor="#2f2f2f"/>
            </linearGradient>
            {/* 타겟 레이어 그라디언트 */}
            <linearGradient id={`layerGrad-${solution}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={targetInfo.layerColor} stopOpacity="0.95"/>
              <stop offset="100%" stopColor={targetInfo.layerColor} stopOpacity="0.55"/>
            </linearGradient>
            {/* 유리 반사 하이라이트 */}
            <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35"/>
              <stop offset="18%" stopColor="#ffffff" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* 세정조 유리 외곽 */}
          <rect x="40" y="55" width="320" height="185" fill="#edf1f5" stroke="#3e4a5a" strokeWidth="2" rx="6"/>
          {/* 세정액 본체 */}
          <rect x="44" y="59" width="312" height="177" fill={`url(#bathGrad-${solution})`} rx="4"/>
          {/* 유리 하이라이트 */}
          <rect x="44" y="59" width="312" height="177" fill="url(#glassShine)" rx="4"/>
          {/* 액면선 */}
          <line x1="44" y1="70" x2="356" y2="70" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="4,3"/>
          <text x="358" y="74" fontSize="9" fill="#4a5568">액면</text>

          {/* 세정액 태그 */}
          <rect x="54" y="80" width="96" height="24" fill="#ffffff" fillOpacity="0.92" stroke="#3e4a5a" strokeWidth="0.8" rx="4"/>
          <text x="102" y="97" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b">{solution} 용액</text>

          {/* ===== 웨이퍼 단면 확대뷰 ===== */}
          <g transform="translate(130, 135)">
            {/* Si 기판 */}
            <rect x="0" y="25" width="140" height="50" fill="url(#siGrad)" stroke="#1e1e1e" strokeWidth="1"/>
            {/* 결정격자 힌트 */}
            {[0,1,2,3,4].map(i => (
              <line key={`lat-${i}`} x1={10 + i*30} y1="30" x2={10 + i*30} y2="70" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.6"/>
            ))}
            <text x="70" y="56" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">Si substrate</text>

            {/* 타겟 레이어 (제거 효율에 따라 두께 변화) */}
            <rect
              x="0"
              y={25 - currentThickness * 2}
              width="140"
              height={currentThickness * 2}
              fill={`url(#layerGrad-${solution})`}
              stroke={targetInfo.layerColor}
              strokeWidth="0.8"
            />

            {/* 오염/층 표면 아이콘 (제거되지 않은 부분만 잔류) */}
            {solution === 'SC1' && Array.from({length: Math.max(0, Math.ceil(9 * (1 - removalEfficiency/100)))}, (_, i) => (
              <circle key={`sc1-p-${i}`} cx={10 + i*16} cy={25 - currentThickness*2 - 2.5} r="2.3" fill="#4a2a0c" stroke="#2a1a00" strokeWidth="0.4"/>
            ))}
            {solution === 'SC2' && Array.from({length: Math.max(0, Math.ceil(10 * (1 - removalEfficiency/100)))}, (_, i) => (
              <g key={`sc2-ion-${i}`}>
                <circle cx={10 + i*14} cy={25 - currentThickness*2 - 1.5} r="1.7" fill="#c04800"/>
                <text x={10 + i*14} y={25 - currentThickness*2 - 4.5} textAnchor="middle" fontSize="7" fontWeight="700" fill="#8a3000">+</text>
              </g>
            ))}
            {solution === 'SPM' && Array.from({length: Math.max(0, Math.ceil(6 * (1 - removalEfficiency/100)))}, (_, i) => (
              <path key={`spm-org-${i}`} d={`M${10 + i*22},${25 - currentThickness*2 - 1} q4,-4 8,0 q4,-4 8,0`} stroke="#6a1a1a" strokeWidth="1.3" fill="none"/>
            ))}
            {solution === 'BOE' && currentThickness > 0.3 && (
              <line x1="0" y1={25 - currentThickness*2} x2="140" y2={25 - currentThickness*2} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.7"/>
            )}

            {/* 두께 측정 - 왼쪽 (초기) */}
            <line x1="-18" y1={25 - initialThickness*2} x2="-18" y2="25" stroke="#555" strokeWidth="1"/>
            <line x1="-21" y1={25 - initialThickness*2} x2="-15" y2={25 - initialThickness*2} stroke="#555" strokeWidth="1"/>
            <line x1="-21" y1="25" x2="-15" y2="25" stroke="#555" strokeWidth="1"/>
            <text x="-23" y={25 - initialThickness + 3} textAnchor="end" fontSize="9" fill="#555">초기</text>

            {/* 두께 측정 - 오른쪽 (현재) */}
            <line x1="158" y1={25 - currentThickness*2} x2="158" y2="25" stroke="#e11d48" strokeWidth="2"/>
            <line x1="155" y1={25 - currentThickness*2} x2="161" y2={25 - currentThickness*2} stroke="#e11d48" strokeWidth="2"/>
            <line x1="155" y1="25" x2="161" y2="25" stroke="#e11d48" strokeWidth="2"/>
            <text x="163" y={25 - currentThickness + 3} fontSize="9" fontWeight="700" fill="#be123c">현재</text>

            {/* 수치 요약 (한 줄) */}
            <text x="70" y="93" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#15803d">
              {solution === 'BOE'
                ? `제거 ${Math.round(500 * removalEfficiency / 100)}Å  ·  남음 ${Math.round(500 * (1 - removalEfficiency / 100))}Å`
                : `제거 ${removalEfficiency.toFixed(1)}%  ·  남음 ${(100 - removalEfficiency).toFixed(1)}%`}
            </text>
          </g>

          {/* 반응물 분자 하강 (처리 중) */}
          {isProcessing && Array.from({length: 5}, (_, i) => {
            const xBase = 168 + i * 18;
            const rxLabel = solution === 'BOE' ? 'HF' : solution === 'SPM' ? 'H₂SO₄' : solution === 'SC1' ? 'NH₄OH' : 'HCl';
            return (
              <g key={`rx-${i}`}>
                <circle cx={xBase} cy="108" r="9" fill={targetInfo.layerColor} fillOpacity="0.18" stroke={targetInfo.layerColor} strokeOpacity="0.7" strokeWidth="0.9">
                  <animate attributeName="cy" values="108;150;108" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`}/>
                  <animate attributeName="fillOpacity" values="0.85;0.25;0.85" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`}/>
                </circle>
                <text x={xBase} y="111" textAnchor="middle" fontSize="8" fontWeight="700" fill={targetInfo.layerColor}>
                  <animate attributeName="y" values="111;153;111" dur="3s" repeatCount="indefinite" begin={`${i * 0.4}s`}/>
                  {rxLabel}
                </text>
              </g>
            );
          })}

          {/* 용해 생성물 상승 (처리 중) */}
          {isProcessing && Array.from({length: Math.max(1, Math.floor(removalEfficiency / 12))}, (_, i) => (
            <circle key={`dis-${i}`} cx={160 + (i % 6) * 16} cy="155" r="1.8" fill="#5aa3c7" fillOpacity="0.75">
              <animate attributeName="cy" values="155;90" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" begin={`${i * 0.25}s`}/>
              <animate attributeName="fillOpacity" values="0.9;0.35;0" dur={`${3 + (i % 3)}s`} repeatCount="indefinite" begin={`${i * 0.25}s`}/>
            </circle>
          ))}

          {/* 반응식 */}
          <text x="200" y="258" textAnchor="middle" fontSize="10" fill="#475569">
            {targetInfo.reactionFormula}
          </text>

          {/* 공정 상태 */}
          <text x="200" y="278" textAnchor="middle" fontSize="12" fontWeight="700" fill={isProcessing ? '#2563eb' : '#475569'}>
            {isProcessing
              ? `${targetInfo.layerName} 제거 진행 중 · ${removalEfficiency.toFixed(1)}% 완료`
              : `현재 제거 효율 ${removalEfficiency.toFixed(1)}%`}
          </text>
        </svg>
        
        {/* 범례 */}
        <div className="mt-3 flex justify-center space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-3 bg-gray-600 mr-1"></div>
            <span>Si 기판</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-3 mr-1" style={{backgroundColor: targetInfo.layerColor, opacity: 0.7}}></div>
            <span>{targetInfo.layerName}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-3 mr-1" style={{backgroundColor: solutionColors[solution]}}></div>
            <span>{solution} 세정액</span>
          </div>
        </div>
      </div>
    );
  };

  // 세정 공정 개요 탭
  const OverviewTab = () => {
    const contaminationData = [
      { type: '입자', wet: 85, dry: 75, ultrasonic: 90 },
      { type: '유기물', wet: 95, dry: 90, ultrasonic: 70 },
      { type: '금속', wet: 90, dry: 65, ultrasonic: 60 }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">웨이퍼 세정 공정의 목적과 중요성</h3>
          <p className="text-blue-700 mb-4">
            반도체 제조 과정에서 웨이퍼 세정은 표면의 오염물질을 제거하여 다음 공정의 품질을 보장하는 핵심 단계입니다.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl mb-2">🦠</div>
              <div className="font-semibold">입자 제거</div>
              <div className="text-sm text-gray-600">물리적 오염물질</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl mb-2">🧪</div>
              <div className="font-semibold">화학적 세정</div>
              <div className="text-sm text-gray-600">유기물/금속 제거</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">표면 활성화</div>
              <div className="text-sm text-gray-600">다음 공정 준비</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">세정 전 웨이퍼 상태</h4>
            <WaferVisualization contaminationLevel={contaminationLevel} />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">세정 후 예상 결과</h4>
            <WaferVisualization 
              contaminationLevel={{
                particles: contaminationLevel.particles * 0.1,
                organics: contaminationLevel.organics * 0.05,
                metals: contaminationLevel.metals * 0.02
              }} 
            />
          </div>
        </div>

        {/* 오염물질별 세정 전략 섹션 추가 */}
        <div className="bg-orange-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">오염물질별 세정 전략</h3>
          <p className="text-orange-700 mb-4">
            오염물질의 종류에 따라 최적의 세정 방법이 다릅니다. 각 방법의 특성을 이해해야 합니다.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">세정 방법별 효율 비교</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contaminationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis label={{ value: '효율 (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="wet" fill="#4caf50" name="습식" />
                  <Bar dataKey="dry" fill="#9c27b0" name="건식" />
                  <Bar dataKey="ultrasonic" fill="#06b6d4" name="초음파" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-red-600 mb-2">🔴 입자 오염물질</h5>
                <ul className="text-sm space-y-1">
                  <li>• 먼지, 파티클</li>
                  <li>• 물리적 제거 필요</li>
                  <li>• 초음파 세정이 가장 효과적</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-green-600 mb-2">🟢 유기물 오염물질</h5>
                <ul className="text-sm space-y-1">
                  <li>• 포토레지스트, 오일</li>
                  <li>• 화학적 분해 필요</li>
                  <li>• 습식 세정(SPM)이 효과적</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-blue-600 mb-2">🔵 금속 오염물질</h5>
                <ul className="text-sm space-y-1">
                  <li>• Cu, Fe, Ni 등</li>
                  <li>• 킬레이션 반응 이용</li>
                  <li>• SC2 용액이 특화</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-green-800 font-semibold mb-2">💡 더 생각해보기</h4>
          <p className="text-green-700">
            왜 반도체 공정에서 세정이 그렇게 중요할까요? 
            만약 세정이 제대로 되지 않으면 어떤 문제들이 발생할 수 있을지 생각해보세요.
          </p>
        </div>
      </div>
    );
  };

  // 습식 세정 탭
  const WetCleaningTab = () => {
    const efficiency = calculateOxideRemovalEfficiency('wet', wetCleaningParams);
    const [isProcessing, setIsProcessing] = useState(false);
    const [finalRemovalEfficiency, setFinalRemovalEfficiency] = useState(0); // 실제 제거 결과
    
    const solutions = [
      { 
        name: 'SC1', 
        desc: 'NH₄OH + H₂O₂ + H₂O', 
        target: '입자 제거', 
        temp: '70-80°C', 
        conc: '1:1:5-10',
        targetType: 'particles',
        targetName: '입자',
        layerName: '입자 오염층'
      },
      { 
        name: 'SC2', 
        desc: 'HCl + H₂O₂ + H₂O', 
        target: '금속 이온 제거', 
        temp: '70-80°C', 
        conc: '1:1:5-10',
        targetType: 'metals',
        targetName: '금속이온',
        layerName: '금속이온막'
      },
      { 
        name: 'SPM', 
        desc: 'H₂SO₄ + H₂O₂', 
        target: '유기물 제거', 
        temp: '120-140°C', 
        conc: '4:1-7:1',
        targetType: 'organics',
        targetName: '유기물',
        layerName: '유기물막'
      },
      { 
        name: 'BOE', 
        desc: 'HF + NH₄F', 
        target: '산화막 제거', 
        temp: '20-25°C', 
        conc: '1:6-1:10',
        targetType: 'oxide',
        targetName: '산화막',
        layerName: 'SiO₂ 산화막'
      }
    ];

    const getCurrentSolution = () => {
      return solutions.find(sol => sol.name === wetCleaningParams.solution);
    };

    // 용액별 반응 kinetics (공정마다 고유한 반응 모델)
    //  - SC1/SC2/SPM: 1차 반응에 가까운 지수 포화형 제거
    //  - BOE: 일정 식각율(Å/min 유사) → 선형 증가 후 완전 제거 시 포화
    const solutionKinetics = {
      SC1: { emax: 95, baseRate: 0.30, refTemp: 75,  tempCoeff: 0.025, refConc: 5, model: 'firstOrder' },
      SC2: { emax: 92, baseRate: 0.18, refTemp: 75,  tempCoeff: 0.022, refConc: 5, model: 'firstOrder' },
      SPM: { emax: 98, baseRate: 0.45, refTemp: 130, tempCoeff: 0.028, refConc: 5, model: 'firstOrder' },
      BOE: { emax: 99, baseRate: 7.0,  refTemp: 25,  tempCoeff: 0.010, refConc: 5, model: 'linearEtch' }
    };
    const kinetics = solutionKinetics[wetCleaningParams.solution] || solutionKinetics.SC1;
    // 아레니우스 유사 온도 보정 + 농도 1차 비례
    const tempFactor = Math.exp(kinetics.tempCoeff * (wetCleaningParams.temperature - kinetics.refTemp));
    const concFactor = wetCleaningParams.concentration / kinetics.refConc;
    const kEff = kinetics.baseRate * tempFactor * concFactor;

    const timeData = Array.from({ length: 20 }, (_, i) => {
      const t = i + 1;
      const eff = kinetics.model === 'linearEtch'
        ? Math.min(kinetics.emax, kEff * t)                       // BOE: 선형 식각
        : kinetics.emax * (1 - Math.exp(-kEff * t));              // 1차 반응: 지수 포화
      return { time: t, efficiency: parseFloat(eff.toFixed(1)) };
    });

    const startProcessing = () => {
      // 세정 시작시 현재 조건으로 효율 계산하고 고정
      const calculatedEfficiency = calculateOxideRemovalEfficiency('wet', wetCleaningParams);
      setFinalRemovalEfficiency(calculatedEfficiency);
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 5000); // 5초 후 자동 종료
    };

    const resetProcess = () => {
      setIsProcessing(false);
      setFinalRemovalEfficiency(0); // 제거 결과 초기화
      setWetCleaningParams({
        solution: 'SC1',
        concentration: 5,
        temperature: 70,
        time: 10
      });
    };

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">습식 세정의 원리와 공정별 특성</h3>
          <p className="text-blue-700 mb-3">
            화학 용액을 사용하여 웨이퍼를 완전히 침지(Dipping)하는 방식으로 오염물질과 산화막을 제거합니다.
          </p>
          <div className="bg-blue-100 p-3 rounded">
            <strong className="text-blue-800">⚠️ 중요:</strong> 각 공정별로 최적 세정 조건(온도, 농도, 시간)이 다르며, 
            특히 <strong>산화막 제거 효율</strong>은 용액 선택과 조건 설정에 크게 의존합니다.
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">세정 조건 설정</h4>
            
            <div>
              <label className="block text-sm font-medium mb-2">세정액 선택</label>
              <select 
                value={wetCleaningParams.solution}
                onChange={(e) => setWetCleaningParams({...wetCleaningParams, solution: e.target.value})}
                className="w-full p-2 border rounded"
                disabled={isProcessing}
              >
                {solutions.map(sol => (
                  <option key={sol.name} value={sol.name}>
                    {sol.name} - {sol.target} ({sol.temp})
                  </option>
                ))}
              </select>
              
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <div><strong>화학식:</strong> {getCurrentSolution()?.desc}</div>
                <div><strong>주요 목적:</strong> {getCurrentSolution()?.target}</div>
                <div><strong>표준 비율:</strong> {getCurrentSolution()?.conc}</div>
                <div><strong>권장 온도:</strong> {getCurrentSolution()?.temp}</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                농도: {wetCleaningParams.concentration}% 
                <span className="text-xs text-gray-500">(실제 비율 조정)</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={wetCleaningParams.concentration}
                onChange={(e) => setWetCleaningParams({...wetCleaningParams, concentration: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded"
                disabled={isProcessing}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                온도: {wetCleaningParams.temperature}°C
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={wetCleaningParams.temperature}
                onChange={(e) => setWetCleaningParams({...wetCleaningParams, temperature: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded"
                disabled={isProcessing}
              />
              <div className="text-xs text-gray-500 mt-1">
                권장: {getCurrentSolution()?.temp}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                시간: {wetCleaningParams.time}분
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={wetCleaningParams.time}
                onChange={(e) => setWetCleaningParams({...wetCleaningParams, time: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded"
                disabled={isProcessing}
              />
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-lg font-semibold">예상 {getCurrentSolution()?.targetName} 제거 효율: {efficiency.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mt-1">
                {efficiency > 90 ? '✅ 우수한 제거 효과' : 
                 efficiency > 70 ? '⚠️ 보통 제거 효과' : '❌ 조건 최적화 필요'}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * 실제 결과는 세정 시작 후 확인 가능
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={startProcessing}
                disabled={isProcessing}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isProcessing ? '세정 진행 중... (5초)' : '습식 세정 시작'}
              </button>
              
              <button
                onClick={resetProcess}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                title="초기 조건으로 리셋"
              >
                🔄 리셋
              </button>
            </div>
            
            {/* 세정 완료 후 실제 결과 표시 */}
            {!isProcessing && finalRemovalEfficiency > 0 && (
              <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
                <div className="font-semibold text-green-800">📊 세정 완료!</div>
                <div className="text-green-700 mt-1">
                  실제 {getCurrentSolution()?.targetName} 제거 효율: <strong>{finalRemovalEfficiency.toFixed(1)}%</strong>
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {getCurrentSolution()?.targetType === 'oxide' ? (
                    <>제거량: {Math.round(500 * finalRemovalEfficiency / 100)}Å / 남은 두께: {Math.round(500 * (1 - finalRemovalEfficiency / 100))}Å</>
                  ) : (
                    <>제거된 {getCurrentSolution()?.targetName}: {finalRemovalEfficiency.toFixed(1)}% / 남은 오염: {(100 - finalRemovalEfficiency).toFixed(1)}%</>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold mb-3">웨이퍼 단면 - {getCurrentSolution()?.layerName} 제거 과정</h4>
            <WaferCrossSectionVisualization 
              solution={wetCleaningParams.solution} 
              isProcessing={isProcessing}
              removalEfficiency={isProcessing || finalRemovalEfficiency > 0 ? finalRemovalEfficiency : 0}
            />
            
            <div className="mt-4">
              <h5 className="font-semibold mb-2">시간에 따른 제거 효율</h5>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: '시간 (분)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: '효율 (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#4caf50" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* 용어 설명 섹션 */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-800 mb-4">📖 주요 용어 설명</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <strong className="text-blue-700">BOE (Buffered Oxide Etch)</strong>
                <p className="text-sm mt-1">HF + NH₄F 혼합 용액. 산화막(SiO₂) 제거에 특화된 완충 식각액</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-green-500">
                <strong className="text-green-700">HF (Hydrofluoric Acid)</strong>
                <p className="text-sm mt-1">불산. 실리콘 산화막과 반응하여 수용성 화합물을 형성</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                <strong className="text-purple-700">NH₄F (Ammonium Fluoride)</strong>
                <p className="text-sm mt-1">플루오르화 암모늄. BOE에서 완충 역할로 식각 속도 조절</p>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-red-500">
                <strong className="text-red-700">SC1/SC2 (Standard Clean)</strong>
                <p className="text-sm mt-1">RCA 세정 표준. SC1은 입자, SC2는 금속 이온 제거용</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 건식 세정 탭
  const DryCleaningTab = () => {
    const efficiency = calculateOxideRemovalEfficiency('dry', dryCleaningParams);
    
    // 건식 세정 방법별 시각화 컴포넌트
    const DryCleaningVisualization = ({ method }) => {
      return (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h5 className="text-center font-semibold text-gray-700 mb-4">{method} 세정 공정</h5>
          <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
            {/* 웨이퍼 기본 원형 */}
            <circle cx="150" cy="200" r="100" fill="#e5e5e5" stroke="#999" strokeWidth="2"/>
            <text x="150" y="205" textAnchor="middle" className="text-sm font-semibold">Si Wafer</text>
            
            {/* 방법별 시각화 */}
            {method === 'ozone' && (
              <g>
                {/* 오존 분자들 */}
                {Array.from({length: 8}, (_, i) => {
                  const angle = (i / 8) * 2 * Math.PI;
                  const x = 150 + Math.cos(angle) * 130;
                  const y = 200 + Math.sin(angle) * 130;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="8" fill="#87CEEB" opacity="0.8">
                        <animate attributeName="cy" 
                                 values={`${y - 10};${y + 10};${y - 10}`} 
                                 dur="2s" repeatCount="indefinite" begin={`${i * 0.25}s`} />
                      </circle>
                      <text x={x} y={y + 4} textAnchor="middle" className="text-xs font-bold">O₃</text>
                    </g>
                  );
                })}
                <text x="150" y="50" textAnchor="middle" className="text-sm font-semibold text-blue-700">
                  오존 분자가 유기물을 산화 분해
                </text>
              </g>
            )}
            
            {method === 'plasma' && (
              <g>
                {/* 플라즈마 이온들 */}
                {Array.from({length: 12}, (_, i) => {
                  const angle = (i / 12) * 2 * Math.PI;
                  const x = 150 + Math.cos(angle) * 140;
                  const y = 200 + Math.sin(angle) * 140;
                  const isPositive = i % 2 === 0;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" 
                              fill={isPositive ? "#FF6B6B" : "#4ECDC4"} 
                              opacity="0.9">
                        <animate attributeName="cx" 
                                 values={`${x - 5};${x + 5};${x - 5}`} 
                                 dur="1s" repeatCount="indefinite" />
                      </circle>
                      <text x={x} y={y + 3} textAnchor="middle" 
                            className="text-xs font-bold text-white">
                        {isPositive ? '+' : '−'}
                      </text>
                    </g>
                  );
                })}
                <text x="150" y="50" textAnchor="middle" className="text-sm font-semibold text-purple-700">
                  이온화된 가스가 물리적으로 오염물질 제거
                </text>
              </g>
            )}
            
            {method === 'uv' && (
              <g>
                {/* UV 램프 */}
                <rect x="120" y="80" width="60" height="15" fill="#FFD700" stroke="#FF8C00" strokeWidth="2" rx="7"/>
                <text x="150" y="92" textAnchor="middle" className="text-xs font-bold">UV Lamp</text>
                
                {/* UV 광선 */}
                {Array.from({length: 6}, (_, i) => (
                  <g key={i}>
                    <line x1="150" y1="95" 
                          x2={150 + (i - 2.5) * 20} y2="180" 
                          stroke="#DDA0DD" strokeWidth="3" opacity="0.7">
                      <animate attributeName="opacity" 
                               values="0.3;1;0.3" 
                               dur="1.5s" repeatCount="indefinite" 
                               begin={`${i * 0.2}s`} />
                    </line>
                  </g>
                ))}
                
                {/* 오존 생성 */}
                {Array.from({length: 4}, (_, i) => (
                  <circle key={i} cx={130 + i * 15} cy={160} r="4" 
                          fill="#87CEEB" opacity="0.6">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" 
                             dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                  </circle>
                ))}
                
                <text x="150" y="50" textAnchor="middle" className="text-sm font-semibold text-purple-700">
                  UV광이 O₂를 O₃로 변환하여 세정
                </text>
              </g>
            )}
            
            {/* 웨이퍼 중심 마크 */}
            <circle cx="150" cy="200" r="3" fill="#666" />
          </svg>
        </div>
      );
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">건식 세정의 특성과 다양성</h3>
          <p className="text-purple-700 mb-3">
            건식 세정은 액체 화학물질을 사용하지 않는 세정 방법으로, 공정 목적과 요구사항에 따라 매우 다양한 형태로 구현됩니다.
          </p>
          <div className="bg-purple-100 p-4 rounded">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-purple-800">환경 조건:</strong>
                <ul className="mt-1 space-y-1 text-purple-700">
                  <li>• 진공 조건 (10⁻⁶ Torr 수준)</li>
                  <li>• 저압 조건 (mTorr ~ Torr)</li>
                  <li>• 대기압 조건</li>
                </ul>
              </div>
              <div>
                <strong className="text-purple-800">적용 목적:</strong>
                <ul className="mt-1 space-y-1 text-purple-700">
                  <li>• 표면 활성화</li>
                  <li>• 유기물 제거</li>
                  <li>• 얇은 산화막 제거</li>
                  <li>• 입자 제거</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">건식 세정 방법 선택</h4>
            
            <div>
              <label className="block text-sm font-medium mb-3">세정 방법</label>
              <div className="space-y-3">
                <label className="flex items-center p-3 bg-gray-50 rounded border cursor-pointer">
                  <input
                    type="radio"
                    name="dryMethod"
                    value="ozone"
                    checked={dryCleaningParams.method === 'ozone'}
                    onChange={(e) => setDryCleaningParams({...dryCleaningParams, method: e.target.value})}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">오존 세정 (O₃ Cleaning)</div>
                    <div className="text-xs text-gray-600">대기압 또는 저압에서 오존의 강한 산화력 이용</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded border cursor-pointer">
                  <input
                    type="radio"
                    name="dryMethod"
                    value="plasma"
                    checked={dryCleaningParams.method === 'plasma'}
                    onChange={(e) => setDryCleaningParams({...dryCleaningParams, method: e.target.value})}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">플라즈마 세정 (Plasma Cleaning)</div>
                    <div className="text-xs text-gray-600">저압에서 이온화된 가스의 물리적/화학적 작용</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 bg-gray-50 rounded border cursor-pointer">
                  <input
                    type="radio"
                    name="dryMethod"
                    value="uv"
                    checked={dryCleaningParams.method === 'uv'}
                    onChange={(e) => setDryCleaningParams({...dryCleaningParams, method: e.target.value})}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">UV/오존 세정 (UV/Ozone)</div>
                    <div className="text-xs text-gray-600">UV광으로 오존 생성 후 광화학 반응 이용</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-sm text-gray-600">
                {dryCleaningParams.method === 'ozone' && '유기물 제거에 특히 효과적'}
                {dryCleaningParams.method === 'plasma' && '물리적 입자 제거와 표면 활성화에 효과적'}
                {dryCleaningParams.method === 'uv' && '표면 유기물의 광분해에 효과적'}
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded">
              <h5 className="text-yellow-800 font-semibold mb-2">공정 조건의 다양성</h5>
              <p className="text-yellow-700 text-sm">
                실제 산업 현장에서는 웨이퍼 재질, 오염물질 종류, 후속 공정 요구사항에 따라 
                압력, 온도, 가스 종류, 처리 시간 등 매우 세밀한 조건 제어가 필요합니다.
              </p>
            </div>
          </div>
          
          <div>
            <DryCleaningVisualization method={dryCleaningParams.method} />
            
            <div className="mt-4 bg-blue-50 p-4 rounded">
              <h5 className="text-blue-800 font-semibold mb-2">
                {dryCleaningParams.method === 'ozone' && '오존 세정의 특징'}
                {dryCleaningParams.method === 'plasma' && '플라즈마 세정의 특징'}
                {dryCleaningParams.method === 'uv' && 'UV/오존 세정의 특징'}
              </h5>
              <ul className="text-blue-700 text-sm space-y-1">
                {dryCleaningParams.method === 'ozone' && (
                  <>
                    <li>• 강한 산화력으로 유기물 완전 분해</li>
                    <li>• 대기압에서도 처리 가능</li>
                    <li>• 잔류물 없이 CO₂와 H₂O로 분해</li>
                    <li>• 온도가 높을수록 반응 속도 증가</li>
                  </>
                )}
                {dryCleaningParams.method === 'plasma' && (
                  <>
                    <li>• 물리적 스퍼터링과 화학적 반응 결합</li>
                    <li>• 저압 환경에서 플라즈마 생성</li>
                    <li>• 방향성 있는 이온 충격</li>
                    <li>• 표면 활성화 효과 우수</li>
                  </>
                )}
                {dryCleaningParams.method === 'uv' && (
                  <>
                    <li>• UV광으로 O₂ → O₃ 변환</li>
                    <li>• 광분해와 오존 산화 동시 작용</li>
                    <li>• 상온에서도 효과적 처리 가능</li>
                    <li>• 균일한 표면 처리</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 초음파 세정 탭
  const UltrasonicTab = () => {
    
    // 초음파 세정 시각화 컴포넌트
    const UltrasonicVisualization = () => {
      return (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h5 className="text-center font-semibold text-gray-700 mb-4">초음파 세정 - 캐비테이션 효과</h5>
          <svg width="400" height="350" viewBox="0 0 400 350" className="mx-auto">
            {/* 세정조 */}
            <rect x="50" y="100" width="300" height="200" fill="#e3f8ff" stroke="#0ea5e9" strokeWidth="2" rx="10"/>
            <text x="200" y="90" textAnchor="middle" className="text-sm font-medium text-blue-700">초음파 세정조</text>
            
            {/* 초음파 트랜스듀서 */}
            <rect x="160" y="300" width="80" height="20" fill="#4b5563" stroke="#374151" strokeWidth="1" rx="3"/>
            <text x="200" y="313" textAnchor="middle" className="text-xs font-bold text-white">Transducer</text>
            
            {/* 웨이퍼 */}
            <circle cx="200" cy="160" r="60" fill="#e5e5e5" stroke="#999" strokeWidth="2"/>
            <text x="200" y="165" textAnchor="middle" className="text-sm font-semibold">Si Wafer</text>
            
            {/* 웨이퍼 위 파티클들 (초기 상태) */}
            {Array.from({length: 12}, (_, i) => {
              const angle = (i / 12) * 2 * Math.PI;
              const x = 200 + Math.cos(angle) * 50;
              const y = 160 + Math.sin(angle) * 50;
              return (
                <circle key={i} cx={x} cy={y} r="3" fill="#8b4513" opacity="0.8">
                  <animate attributeName="cx" 
                           values={`${x};${x + Math.random() * 40 - 20};${200 + Math.cos(angle + Math.PI) * 80}`} 
                           dur="4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  <animate attributeName="cy" 
                           values={`${y};${y + Math.random() * 40 - 20};${160 + Math.sin(angle + Math.PI) * 80}`} 
                           dur="4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                  <animate attributeName="opacity" 
                           values="0.8;0.6;0.3" 
                           dur="4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                </circle>
              );
            })}
            
            {/* 초음파 음파 표현 */}
            {Array.from({length: 6}, (_, i) => (
              <circle key={`wave-${i}`} cx="200" cy="280" r={20 + i * 15} 
                      fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.6">
                <animate attributeName="r" 
                         values={`${10 + i * 15};${60 + i * 15}`} 
                         dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="opacity" 
                         values="0.8;0.2;0" 
                         dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            ))}
            
            {/* 캐비테이션 버블들 */}
            {Array.from({length: 20}, (_, i) => {
              const x = 80 + Math.random() * 240;
              const y = 120 + Math.random() * 160;
              return (
                <circle key={`bubble-${i}`} cx={x} cy={y} r="2" 
                        fill="#87ceeb" stroke="#4682b4" strokeWidth="1" opacity="0.7">
                  <animate attributeName="r" 
                           values="1;4;1" 
                           dur="1.5s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                  <animate attributeName="opacity" 
                           values="0.3;0.9;0.3" 
                           dur="1.5s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                  <animate attributeName="cy" 
                           values={`${y};${y - 10};${y}`} 
                           dur="2s" repeatCount="indefinite" begin={`${i * 0.1}s`} />
                </circle>
              );
            })}
            
            {/* 마이크로제트 효과 (버블 붕괴시) */}
            {Array.from({length: 8}, (_, i) => {
              const angle = (i / 8) * 2 * Math.PI;
              const startX = 200 + Math.cos(angle) * 65;
              const startY = 160 + Math.sin(angle) * 65;
              const endX = 200 + Math.cos(angle) * 45;
              const endY = 160 + Math.sin(angle) * 45;
              return (
                <line key={`jet-${i}`} 
                      x1={startX} y1={startY} 
                      x2={endX} y2={endY} 
                      stroke="#ff6b35" strokeWidth="2" opacity="0.8">
                  <animate attributeName="opacity" 
                           values="0;1;0" 
                           dur="0.5s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  <animate attributeName="strokeWidth" 
                           values="1;3;1" 
                           dur="0.5s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                </line>
              );
            })}
            
            {/* 주파수 표시 */}
            <text x="200" y="40" textAnchor="middle" className="text-sm font-semibold text-cyan-700">
              40 kHz 초음파 주파수
            </text>
            
            {/* 설명 텍스트 */}
            <text x="200" y="330" textAnchor="middle" className="text-xs text-gray-600">
              캐비테이션 버블 생성 → 붕괴 → 마이크로제트로 파티클 제거
            </text>
          </svg>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="bg-cyan-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-cyan-800 mb-3">초음파 세정의 물리적 원리</h3>
          <p className="text-cyan-700 mb-3">
            초음파 에너지가 액체에서 <strong>캐비테이션(Cavitation) 현상</strong>을 일으켜 
            미세한 버블들이 생성되고 붕괴하면서 강력한 마이크로제트를 형성하여 파티클을 물리적으로 분쇄·제거합니다.
          </p>
          <div className="bg-cyan-100 p-4 rounded">
            <h4 className="font-semibold text-cyan-800 mb-2">캐비테이션 과정</h4>
            <div className="text-cyan-700 text-sm space-y-1">
              <div><strong>1단계:</strong> 초음파 진동이 액체 내 압력 변화 생성</div>
              <div><strong>2단계:</strong> 저압 영역에서 미세 기포(캐비테이션 버블) 형성</div>
              <div><strong>3단계:</strong> 고압 영역에서 버블이 급격히 붕괴</div>
              <div><strong>4단계:</strong> 붕괴 시 발생하는 마이크로제트가 파티클을 타격하여 제거</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">초음파 세정의 특성</h4>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-cyan-500">
                <h5 className="font-semibold text-cyan-700 mb-2">물리적 메커니즘</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 화학적 반응이 아닌 순수 물리적 힘 사용</li>
                  <li>• 웨이퍼 손상 없이 미세 파티클까지 제거</li>
                  <li>• 복잡한 형상의 틈새까지 세정 가능</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h5 className="font-semibold text-blue-700 mb-2">캐비테이션 효과</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 버블 붕괴 시 수천 기압의 순간압력 발생</li>
                  <li>• 국소적으로 5000K의 고온 생성</li>
                  <li>• 마이크로제트 속도: ~100m/s</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                <h5 className="font-semibold text-green-700 mb-2">적용 분야</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 웨이퍼 전처리 세정</li>
                  <li>• 포토마스크 세정</li>
                  <li>• 정밀 부품 세정</li>
                  <li>• 의료기기 멸균</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <UltrasonicVisualization />
            
            <div className="mt-4 bg-orange-50 p-4 rounded">
              <h5 className="text-orange-800 font-semibold mb-2">주의사항 및 한계</h5>
              <ul className="text-orange-700 text-sm space-y-1">
                <li>• 과도한 에너지는 웨이퍼 표면 손상 가능</li>
                <li>• 두꺼운 산화막이나 강한 화학결합 제거에는 부적합</li>
                <li>• 액체 매질이 반드시 필요 (보통 DI water 사용)</li>
                <li>• 웨이퍼 패턴이 미세할수록 신중한 조건 설정 필요</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-yellow-800 mb-4">실제 적용에서의 고려사항</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
              <strong className="text-yellow-700">주파수 선택</strong>
              <p className="text-sm mt-1 text-yellow-600">20-200 kHz 범위에서 파티클 크기와 웨이퍼 패턴에 따라 최적화</p>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
              <strong className="text-yellow-700">세정액 선택</strong>
              <p className="text-sm mt-1 text-yellow-600">DI water, IPA, 또는 계면활성제 첨가로 세정력 향상</p>
            </div>
            <div className="bg-white p-3 rounded border-l-4 border-yellow-500">
              <strong className="text-yellow-700">시간 제어</strong>
              <p className="text-sm mt-1 text-yellow-600">과세정 방지를 위한 정밀한 시간 제어 필수</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 세정 평가 퀴즈 탭
  const QuizTab = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    
    const questions = [
      {
        question: "BOE(Buffered Oxide Etch) 용액에서 NH₄F를 첨가하는 주요 목적은?",
        options: ["산화막 제거 속도 향상", "식각 속도의 완충 및 균일성 확보", "금속 이온 제거", "표면 활성화"],
        correct: 1,
        explanation: "NH₄F는 HF의 식각 속도를 완충시켜 균일하고 제어 가능한 산화막 제거를 가능하게 합니다."
      },
      {
        question: "웨이퍼 표면에 Cu 금속 오염이 발견되었을 때, 가장 적절한 1차 세정 방법은?",
        options: ["BOE로 산화막과 함께 제거", "SC1으로 입자와 함께 제거", "SC2로 킬레이션 반응 이용", "SPM으로 고온 산화"],
        correct: 2,
        explanation: "SC2(HCl + H₂O₂)는 Cu 등 금속 이온과 킬레이션 반응을 통해 수용성 화합물을 형성하여 제거합니다."
      },
      {
        question: "초음파 세정에서 캐비테이션 버블이 붕괴할 때 발생하는 현상이 아닌 것은?",
        options: ["수천 기압의 순간 압력", "5000K 수준의 국소 고온", "마이크로제트 형성", "이온화 플라즈마 생성"],
        correct: 3,
        explanation: "이온화 플라즈마 생성은 플라즈마 세정에서 일어나는 현상입니다. 캐비테이션은 물리적 압력과 온도 변화로 마이크로제트를 형성합니다."
      },
      {
        question: "반도체 공정에서 RCA 세정의 정확한 순서는?",
        options: ["SC1 → SC2 → HF dip", "SPM → SC1 → SC2", "SC2 → SC1 → BOE", "HF dip → SC1 → SC2"],
        correct: 0,
        explanation: "표준 RCA 세정은 SC1(입자 제거) → SC2(금속 제거) → HF dip(자연산화막 제거) 순서로 진행됩니다."
      },
      {
        question: "건식 세정에서 플라즈마 방식과 오존 방식의 주요 차이점은?",
        options: ["플라즈마는 화학적, 오존은 물리적 제거", "플라즈마는 저압 필요, 오존은 대기압 가능", "플라즈마는 유기물 전용, 오존은 입자 전용", "효과는 동일하지만 비용만 다름"],
        correct: 1,
        explanation: "플라즈마 세정은 이온화를 위해 저압 환경이 필요하지만, 오존 세정은 대기압에서도 가능합니다."
      },
      {
        question: "SPM(Sulfuric acid + Hydrogen Peroxide Mixture) 세정에서 온도를 120-140°C로 유지하는 이유는?",
        options: ["H₂O₂ 분해 방지", "유기물 산화 반응 촉진", "웨이퍼 열팽창 유도", "용액 점도 조절"],
        correct: 1,
        explanation: "고온에서 H₂SO₄와 H₂O₂의 강력한 산화 반응이 촉진되어 유기물을 CO₂와 H₂O로 완전 분해할 수 있습니다."
      },
      {
        question: "웨이퍼 표면에 포토레지스트 잔여물과 미세 파티클이 동시에 존재할 때, 가장 효율적인 세정 전략은?",
        options: ["SC1 → 초음파 → SC2", "SPM → SC1 → 초음파", "초음파 → SPM → SC2", "BOE → SPM → 초음파"],
        correct: 1,
        explanation: "SPM으로 유기물(포토레지스트) 제거 → SC1으로 화학적 세정 → 초음파로 미세 파티클 물리적 제거가 효율적입니다."
      },
      {
        question: "초음파 세정 시 주파수를 40kHz로 설정하는 이유는?",
        options: ["웨이퍼 공진 주파수와 일치", "캐비테이션 효과 최적화", "전력 소모 최소화", "화학 반응 촉진"],
        correct: 1,
        explanation: "40kHz는 액체에서 캐비테이션 버블의 생성과 붕괴가 가장 활발하게 일어나는 최적 주파수입니다."
      },
      {
        question: "UV/오존 세정과 단순 오존 세정의 주요 차이점은?",
        options: ["UV는 입자 제거, 오존은 유기물 제거", "UV는 광분해 병행, 오존은 산화만 진행", "효과는 동일하지만 속도가 다름", "UV는 고온 필요, 오존은 상온 가능"],
        correct: 1,
        explanation: "UV/오존 세정은 UV광에 의한 유기물의 직접 광분해와 UV로 생성된 오존의 산화 작용이 동시에 진행됩니다."
      },
      {
        question: "세정액 온도가 권장값보다 높을 때 발생할 수 있는 문제가 아닌 것은?",
        options: ["세정액 성분 분해 가속화", "웨이퍼 열변형 위험", "반응 속도 과도한 증가", "세정 효율 저하"],
        correct: 3,
        explanation: "온도가 높아지면 일반적으로 세정 효율은 증가합니다. 다만 과도한 온도는 부작용(성분 분해, 열변형, 과반응)을 유발할 수 있습니다."
      }
    ];

    const handleAnswer = () => {
      if (selectedAnswer === questions[currentQuestion].correct.toString()) {
        setScore(score + 1);
      }
      setShowResult(true);
    };

    const nextQuestion = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer('');
        setShowResult(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">웨이퍼 세정 이해도 평가</h3>
          <p className="text-indigo-700">
            학습한 내용을 바탕으로 문제를 풀어보세요. 총 {questions.length}문제입니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="mb-4">
            <span className="text-sm text-gray-500">문제 {currentQuestion + 1}/{questions.length}</span>
            <div className="text-sm text-gray-500">현재 점수: {score}/{currentQuestion + (showResult ? 1 : 0)}</div>
          </div>
          
          <h4 className="text-lg font-semibold mb-4">{questions[currentQuestion].question}</h4>
          
          <div className="space-y-2 mb-4">
            {questions[currentQuestion].options.map((option, index) => (
              <label key={index} className="flex items-center p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={selectedAnswer === index.toString()}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  className="mr-3"
                />
                {option}
              </label>
            ))}
          </div>
          
          {!showResult ? (
            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              답안 제출
            </button>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded ${selectedAnswer === questions[currentQuestion].correct.toString() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="font-semibold">
                  {selectedAnswer === questions[currentQuestion].correct.toString() ? '✅ 정답입니다!' : '❌ 오답입니다.'}
                </div>
                <div className="mt-2">{questions[currentQuestion].explanation}</div>
              </div>
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  다음 문제
                </button>
              ) : (
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-xl font-bold text-blue-800">
                    최종 점수: {score}/{questions.length}
                  </div>
                  <div className="text-blue-600 mt-2">
                    {score === questions.length ? '🏆 완벽합니다!' : 
                     score >= questions.length * 0.7 ? '👍 좋습니다!' : '📚 더 학습해보세요!'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Theory opening steps
  const theorySteps = [
    {
      title: "🎯 세정(Cleaning)이란?",
      content: "반도체 웨이퍼 표면의 오염물질을 제거하여 깨끗한 상태로 만드는 핵심 공정입니다.\n\n" +
               "반도체 제조 공정에서 가장 많이 반복되는 단계로, **전체 공정의 30% 이상**을 차지합니다!\n\n" +
               "💡 **오염물질의 종류**\n" +
               "   • **입자(Particles)**: 먼지, 미세 파편 (0.1μm 이하도 치명적!)\n" +
               "   • **유기물(Organics)**: 포토레지스트 잔류물, 오일, 실리콘\n" +
               "   • **금속(Metals)**: Fe, Cu, Na 등 미량 금속 이온\n" +
               "   • **자연 산화막(Native Oxide)**: 공기 중 형성되는 얇은 SiO₂층\n\n" +
               "⚠️ **왜 중요한가?**\n" +
               "   • 단 **1개의 먼지**도 칩 전체를 불량으로 만들 수 있음\n" +
               "   • 금속 오염은 **누설 전류**와 **수명 감소** 유발\n" +
               "   • 클린룸 Class 1 (1ft³당 0.1μm 입자 1개 미만) 필수",
      highlight: "세정이 없으면 반도체 제조는 불가능! 수율의 핵심입니다.",
      icon: "🎯"
    },
    {
      title: "🔬 습식 vs 건식 세정",
      content: "세정 방법은 크게 습식(Wet)과 건식(Dry)으로 나뉩니다.\n\n" +
               "**💧 습식 세정(Wet Cleaning)**\n\n" +
               "1️⃣ **RCA 세정** (Radio Corporation of America)\n" +
               "   • **SC-1** (Standard Clean 1): NH₄OH + H₂O₂ + H₂O\n" +
               "     - 입자 및 유기물 제거\n" +
               "     - 온도: 70~80°C, 시간: 10분\n" +
               "   • **SC-2** (Standard Clean 2): HCl + H₂O₂ + H₂O\n" +
               "     - 금속 이온 제거\n" +
               "     - 온도: 70~80°C, 시간: 10분\n\n" +
               "2️⃣ **HF 처리**\n" +
               "   • 산화막 제거: SiO₂ + 6HF → H₂SiF₆ + 2H₂O\n" +
               "   • 희석 HF (1~2%) 사용\n\n" +
               "3️⃣ **SPM** (Sulfuric Peroxide Mixture)\n" +
               "   • H₂SO₄ + H₂O₂ (Piranha solution)\n" +
               "   • 강력한 유기물 제거 (150°C 이상)\n\n" +
               "**⚡ 건식 세정(Dry Cleaning)**\n" +
               "   • **플라즈마 세정**: O₂, Ar, N₂, H₂ 플라즈마\n" +
               "   • **UV/오존 세정**: UV 조사로 유기물 분해\n" +
               "   • **초임계 CO₂**: 화학약품 없는 친환경 세정\n" +
               "   • 장점: 건조 공정 불필요, 화학약품 사용 최소화",
      highlight: "용도에 따라 선택! 대부분 습식, 미세 패턴에서는 건식 병행",
      icon: "🔬"
    },
    {
      title: "📈 세정 기술의 발전",
      content: "반도체 미세화와 함께 세정 기술도 진화했습니다.\n\n" +
               "**🕐 1970년대: RCA 세정 개발**\n" +
               "   • Werner Kern이 개발한 표준 세정법\n" +
               "   • 현재까지도 기본 방법으로 사용\n\n" +
               "**🕑 1980~90년대: 메가소닉 세정**\n" +
               "   • 900 kHz~1 MHz 초음파\n" +
               "   • 물리적 + 화학적 세정 결합\n" +
               "   • 입자 제거 효율 획기적 향상\n\n" +
               "**🕒 2000년대: Single Wafer 세정**\n" +
               "   • 배치(Batch) → 매엽(Single wafer) 방식\n" +
               "   • 정밀한 공정 제어\n" +
               "   • Cross contamination 방지\n\n" +
               "**🕓 2010년대: 환경 친화적 세정**\n" +
               "   • **DIW** (De-Ionized Water) 사용 증가\n" +
               "   • **Ozonated water** (O₃ 용존 초순수)\n" +
               "   • 화학약품 사용량 50% 감소\n\n" +
               "**🕔 현재: EUV 리소그래피 대응**\n" +
               "   • **원자층 수준** 청정도 요구\n" +
               "   • 금속 오염 기준: **10¹⁰ atoms/cm²** 이하\n" +
               "   • **Cryogenic 세정**, **초임계 유체** 도입\n\n" +
               "📊 **시장 규모**: 세정 장비 시장 약 **60억 달러**(2024)\n" +
               "💎 **핵심 기업**: SCREEN, Tokyo Electron, LAM Research, Veeco",
      highlight: "청정도 요구사항은 계속 엄격해집니다!",
      icon: "📈"
    },
    {
      title: "🏭 실제 산업 응용",
      content: "세정은 거의 모든 반도체 공정 단계에서 필수적입니다.\n\n" +
               "**🔄 공정 단계별 세정**\n\n" +
               "1️⃣ **Pre-diffusion Clean**\n" +
               "   • 불순물 도입 전 표면 청정화\n" +
               "   • RCA 세정 + HF dip\n\n" +
               "2️⃣ **Post-Etch Clean**\n" +
               "   • 식각 후 잔류물 제거\n" +
               "   • 폴리머, 부산물 제거\n" +
               "   • SPM 또는 플라즈마 세정\n\n" +
               "3️⃣ **Pre-Deposition Clean**\n" +
               "   • 박막 증착 전 산화막 제거\n" +
               "   • HF 마지막 처리\n" +
               "   • 원자층 수준 청정도\n\n" +
               "4️⃣ **CMP 후 세정**\n" +
               "   • 연마(Polishing) 후 슬러리 제거\n" +
               "   • 브러시 + 화학약품 세정\n\n" +
               "5️⃣ **Final Clean**\n" +
               "   • 칩 완성 후 최종 세정\n" +
               "   • 패키징 전 표면 처리\n\n" +
               "**📱 응용 제품별**\n" +
               "   • **Logic**: 30~40 단계 세정\n" +
               "   • **Memory**: 50~60 단계 세정\n" +
               "   • **MEMS**: 희생층 제거 + 릴리스 세정\n\n" +
               "**👨‍🔬 세정 엔지니어의 역할**\n" +
               "   • 오염 분석 (TXRF, ICP-MS)\n" +
               "   • 세정 레시피 최적화\n" +
               "   • 수율 향상 (세정 불량 **50% 이상** 감소)",
      highlight: "반도체 제조의 숨은 영웅! 세정이 수율을 좌우합니다.",
      icon: "🏭"
    },
    {
      title: "🎓 이 시뮬레이터로 배우는 내용",
      content: "다양한 세정 방법을 직접 체험하며 완벽히 이해할 수 있습니다.\n\n" +
               "**📚 각 탭별 학습 목표**\n\n" +
               "1️⃣ **개요(Overview)**: 세정 공정의 기초와 중요성\n" +
               "   • 오염물질 종류와 영향\n" +
               "   • 세정 방법 분류\n\n" +
               "2️⃣ **습식 세정(Wet Cleaning)**: 화학적 세정 실습\n" +
               "   • SC-1, SC-2 레시피 조정\n" +
               "   • 온도, 농도, 시간 최적화\n" +
               "   • 오염 제거율 실시간 확인\n\n" +
               "3️⃣ **건식 세정(Dry Cleaning)**: 플라즈마 세정 체험\n" +
               "   • O₂, Ar, N₂ 가스 선택\n" +
               "   • RF 파워와 압력 제어\n" +
               "   • 선택적 세정 특성\n\n" +
               "4️⃣ **초음파 세정(Ultrasonic)**: 물리적 세정 이해\n" +
               "   • 주파수 효과 (40 kHz vs 1 MHz)\n" +
               "   • 캐비테이션 현상\n" +
               "   • 입자 제거 메커니즘\n\n" +
               "5️⃣ **평가(Quiz)**: 학습 내용 점검\n\n" +
               "**💡 학습 방법**\n" +
               "   ① 오염물질 유형 파악 → ② 세정 방법 선택\n" +
               "   ③ 조건 최적화 → ④ 결과 분석\n\n" +
               "**🎯 학습 목표**\n" +
               "   • RCA 세정 프로세스 완벽 이해\n" +
               "   • 오염물질별 최적 세정법 선택\n" +
               "   • 실무 수준의 레시피 설계 능력!",
      highlight: "지금 바로 클린룸에서 세정 공정을 시작해보세요! 🧼",
      icon: "🎓"
    }
  ];

  // Typing animation effect for theory
  useEffect(() => {
    if (isTheoryPlaying && theoryStep < theorySteps.length) {
      const fullText = theorySteps[theoryStep].content;
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 20);

      return () => clearInterval(typingInterval);
    }
  }, [isTheoryPlaying, theoryStep]);

  // Theory control functions
  const startTheoryAnimation = () => {
    setIsTheoryPlaying(true);
    setTheoryStep(0);
    setTypedText('');
  };

  const stopTheoryAnimation = () => {
    setIsTheoryPlaying(false);
  };

  const nextTheoryStep = () => {
    if (theoryStep < theorySteps.length - 1) {
      setTheoryStep(prev => prev + 1);
      setTypedText('');
    } else {
      setIsTheoryPlaying(false);
    }
  };

  const prevTheoryStep = () => {
    if (theoryStep > 0) {
      setTheoryStep(prev => prev - 1);
      setTypedText('');
    }
  };

  // Auto-scroll storytelling content
  useEffect(() => {
    if (storyContentRef.current && isTheoryPlaying) {
      storyContentRef.current.scrollTop = storyContentRef.current.scrollHeight;
    }
  }, [typedText, isTheoryPlaying]);

  // SVG diagrams for each theory step
  const getTheorySVG = (step) => {
    const svgClass = "w-full h-full max-h-96";
    switch(step) {
      case 0: return (
        <svg viewBox="0 0 280 280" className={svgClass}>
          <rect width="280" height="280" fill="#0f172a" fillOpacity="0.9" rx="10"/>
          <text x="140" y="22" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">세정이란? 오염물질 제거</text>
          {/* 웨이퍼 */}
          <ellipse cx="140" cy="80" rx="90" ry="18" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="140" y="84" textAnchor="middle" fill="#f1f5f9" fontSize="10" fontWeight="bold">Si 웨이퍼</text>
          {/* 오염 입자들 */}
          <circle cx="90" cy="70" r="3" fill="#ef4444"/>
          <circle cx="120" cy="68" r="2.5" fill="#fbbf24"/>
          <circle cx="160" cy="72" r="3" fill="#a855f7"/>
          <circle cx="190" cy="68" r="2" fill="#22c55e"/>
          <circle cx="100" cy="90" r="2" fill="#ec4899"/>
          <circle cx="180" cy="88" r="2.5" fill="#f97316"/>
          <text x="140" y="118" textAnchor="middle" fill="#fca5a5" fontSize="9" fontWeight="bold">⚠️ 0.1μm 입자도 치명적!</text>
          {/* 오염물 박스 */}
          <rect x="15" y="132" width="250" height="140" rx="6" fill="#1e293b" fillOpacity="0.8" stroke="#fde047" strokeWidth="0.5" strokeDasharray="3"/>
          <text x="140" y="152" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">4가지 오염물질</text>
          <circle cx="30" cy="172" r="4" fill="#ef4444"/>
          <text x="42" y="176" fill="#fca5a5" fontSize="10" fontWeight="bold">입자 (Particles)</text>
          <text x="150" y="176" fill="#ffffff" fontSize="9">먼지, 미세 파편</text>
          <circle cx="30" cy="194" r="4" fill="#fbbf24"/>
          <text x="42" y="198" fill="#fde047" fontSize="10" fontWeight="bold">유기물 (Organics)</text>
          <text x="150" y="198" fill="#ffffff" fontSize="9">PR 잔류물, 오일</text>
          <circle cx="30" cy="216" r="4" fill="#a855f7"/>
          <text x="42" y="220" fill="#c4b5fd" fontSize="10" fontWeight="bold">금속 (Metals)</text>
          <text x="150" y="220" fill="#ffffff" fontSize="9">Fe, Cu, Na 이온</text>
          <circle cx="30" cy="238" r="4" fill="#22c55e"/>
          <text x="42" y="242" fill="#86efac" fontSize="10" fontWeight="bold">자연 산화막</text>
          <text x="150" y="242" fill="#ffffff" fontSize="9">Native SiO₂</text>
          <text x="140" y="262" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">💡 전체 공정의 30% 이상!</text>
        </svg>
      );
      case 1: return (
        <svg viewBox="0 0 280 280" className={svgClass}>
          <rect width="280" height="280" fill="#0f172a" fillOpacity="0.9" rx="10"/>
          <text x="140" y="22" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">습식 vs 건식 세정</text>
          {/* 습식 */}
          <rect x="10" y="35" width="125" height="130" rx="6" fill="#1e293b" fillOpacity="0.8" stroke="#60a5fa" strokeWidth="1.5"/>
          <text x="72" y="55" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">💧 습식 세정</text>
          <text x="18" y="76" fill="#ffffff" fontSize="9" fontWeight="bold">RCA 세정:</text>
          <text x="18" y="90" fill="#e0e7ff" fontSize="8">• SC-1: NH₄OH+H₂O₂</text>
          <text x="18" y="102" fill="#e0e7ff" fontSize="8">  (입자, 유기물)</text>
          <text x="18" y="116" fill="#e0e7ff" fontSize="8">• SC-2: HCl+H₂O₂</text>
          <text x="18" y="128" fill="#e0e7ff" fontSize="8">  (금속 이온)</text>
          <text x="18" y="144" fill="#ffffff" fontSize="9" fontWeight="bold">HF: 산화막 제거</text>
          <text x="18" y="158" fill="#ffffff" fontSize="9" fontWeight="bold">SPM: 강력 유기물</text>
          {/* 건식 */}
          <rect x="145" y="35" width="125" height="130" rx="6" fill="#1e293b" fillOpacity="0.8" stroke="#c4b5fd" strokeWidth="1.5"/>
          <text x="207" y="55" textAnchor="middle" fill="#c4b5fd" fontSize="12" fontWeight="bold">⚡ 건식 세정</text>
          <text x="153" y="76" fill="#ffffff" fontSize="9" fontWeight="bold">플라즈마 세정:</text>
          <text x="153" y="90" fill="#ddd6fe" fontSize="8">• O₂, Ar, N₂, H₂</text>
          <text x="153" y="104" fill="#ddd6fe" fontSize="8">  플라즈마</text>
          <text x="153" y="122" fill="#ffffff" fontSize="9" fontWeight="bold">UV/오존:</text>
          <text x="153" y="136" fill="#ddd6fe" fontSize="8">• 유기물 분해</text>
          <text x="153" y="152" fill="#ffffff" fontSize="9" fontWeight="bold">초임계 CO₂:</text>
          <text x="153" y="164" fill="#86efac" fontSize="8">• 친환경</text>
          {/* 요약 박스 */}
          <rect x="10" y="178" width="260" height="90" rx="6" fill="#1e293b" fillOpacity="0.8" stroke="#fde047" strokeWidth="0.5" strokeDasharray="3"/>
          <text x="140" y="196" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">선택 기준</text>
          <text x="20" y="216" fill="#93c5fd" fontSize="10">💧 대부분: 습식 (높은 제거 효율)</text>
          <text x="20" y="234" fill="#c4b5fd" fontSize="10">⚡ 미세 패턴: 건식 병행</text>
          <text x="20" y="252" fill="#86efac" fontSize="10">🌱 친환경: 초임계 CO₂</text>
        </svg>
      );
      case 2: return (
        <svg viewBox="0 0 280 280" className={svgClass}>
          <rect width="280" height="280" fill="#0f172a" fillOpacity="0.9" rx="10"/>
          <text x="140" y="22" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">세정 기술 발전사</text>
          <line x1="45" y1="40" x2="45" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3"/>
          {[
            { y: 42, era: '1970s', label: 'RCA 세정', desc: 'Werner Kern 표준법', color: '#CBD5E1' },
            { y: 84, era: '1980~90s', label: '메가소닉', desc: '900 kHz~1 MHz 초음파', color: '#93C5FD' },
            { y: 126, era: '2000s', label: 'Single Wafer', desc: '매엽식 정밀 제어', color: '#C4B5FD' },
            { y: 168, era: '2010s', label: '환경 친화', desc: 'DIW, Ozonated water', color: '#86EFAC' },
            { y: 210, era: '현재', label: 'EUV 대응', desc: '원자층 청정도', color: '#FCD34D' },
          ].map((item, i) => (
            <g key={`era${i}`}>
              <circle cx="45" cy={item.y + 10} r="7" fill={item.color} stroke="#0f172a" strokeWidth="1.5"/>
              <text x="60" y={item.y + 5} fill={item.color} fontSize="10" fontWeight="bold">{item.era}</text>
              <text x="60" y={item.y + 19} fill="#ffffff" fontSize="10" fontWeight="bold">{item.label}</text>
              <text x="60" y={item.y + 31} fill="#e2e8f0" fontSize="8">{item.desc}</text>
            </g>
          ))}
          <rect x="10" y="256" width="260" height="18" rx="4" fill="#1e293b" fillOpacity="0.8" stroke="#fde047" strokeWidth="0.5"/>
          <text x="140" y="269" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">📊 세정 장비 시장 $60억 (2024)</text>
        </svg>
      );
      case 3: return (
        <svg viewBox="0 0 280 280" className={svgClass}>
          <rect width="280" height="280" fill="#0f172a" fillOpacity="0.9" rx="10"/>
          <text x="140" y="22" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">공정 단계별 세정</text>
          {[
            { y: 36, label: '1. Pre-diffusion', desc: 'RCA + HF dip', color: '#93C5FD' },
            { y: 82, label: '2. Post-Etch', desc: '폴리머 잔류물 제거', color: '#FCA5A5' },
            { y: 128, label: '3. Pre-Deposition', desc: 'HF 마지막 처리', color: '#C4B5FD' },
            { y: 174, label: '4. Post-CMP', desc: '슬러리 제거', color: '#FCD34D' },
            { y: 220, label: '5. Final Clean', desc: '패키징 전 처리', color: '#86EFAC' },
          ].map((step, i) => (
            <g key={`step${i}`}>
              <rect x="15" y={step.y} width="250" height="38" rx="6" fill="#1e293b" fillOpacity="0.85" stroke={step.color} strokeWidth="1.5"/>
              <circle cx="38" cy={step.y + 19} r="12" fill={step.color} fillOpacity="0.9"/>
              <text x="38" y={step.y + 23} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">{i + 1}</text>
              <text x="58" y={step.y + 17} fill={step.color} fontSize="11" fontWeight="bold">{step.label}</text>
              <text x="58" y={step.y + 31} fill="#ffffff" fontSize="9">{step.desc}</text>
            </g>
          ))}
          <text x="140" y="270" textAnchor="middle" fill="#fde047" fontSize="9" fontWeight="bold">Logic 30~40회 · Memory 50~60회</text>
        </svg>
      );
      case 4: return (
        <svg viewBox="0 0 280 280" className={svgClass}>
          <rect width="280" height="280" fill="#0f172a" fillOpacity="0.9" rx="10"/>
          <text x="140" y="22" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">학습 로드맵</text>
          {[
            { y: 38, label: '개요 (Overview)', desc: '오염물질과 중요성', color: '#93C5FD' },
            { y: 86, label: '습식 세정', desc: 'SC-1, SC-2 레시피', color: '#60A5FA' },
            { y: 134, label: '건식 세정', desc: '플라즈마 O₂/Ar/N₂', color: '#C4B5FD' },
            { y: 182, label: '초음파 세정', desc: '캐비테이션 현상', color: '#FCD34D' },
            { y: 230, label: '평가 (Quiz)', desc: '학습 점검', color: '#86EFAC' },
          ].map((tab, i) => (
            <g key={`tab${i}`}>
              <rect x="15" y={tab.y} width="250" height="40" rx="6" fill="#1e293b" fillOpacity="0.85" stroke={tab.color} strokeWidth="1.5"/>
              <circle cx="38" cy={tab.y + 20} r="12" fill={tab.color} fillOpacity="0.9"/>
              <text x="38" y={tab.y + 25} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">{i + 1}</text>
              <text x="58" y={tab.y + 18} fill={tab.color} fontSize="11" fontWeight="bold">{tab.label}</text>
              <text x="58" y={tab.y + 32} fill="#ffffff" fontSize="9">{tab.desc}</text>
            </g>
          ))}
        </svg>
      );
      default: return null;
    }
  };

  // Theory Tab Component
  const TheoryTab = () => (
    <div className="flex-1 min-h-0 flex flex-col">
      {!showDetailedTheory ? (
        <div className="bg-gradient-to-br from-green-600 via-teal-600 to-cyan-600 rounded-xl shadow-2xl p-6 text-white flex-1 min-h-0 flex flex-col" style={{minHeight: '600px', maxHeight: 'calc(100vh - 200px)'}}>
          {!isTheoryPlaying ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-4xl font-bold mb-4">
                세정 공정 시뮬레이터
              </h2>
              <p className="text-xl text-green-100 max-w-2xl leading-relaxed">
                반도체 제조의 숨은 영웅, 세정 공정의 세계로 초대합니다!<br/>
                <span className="text-yellow-300 font-bold">5단계 스토리텔링</span>으로 쉽고 재미있게 배워보세요!
              </p>
              <button
                onClick={startTheoryAnimation}
                className="flex items-center gap-3 px-8 py-4 bg-white text-green-600 rounded-full hover:bg-yellow-50 transition-all text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 mt-8"
              >
                <PlayIcon />
                시작하기
              </button>
              <p className="text-sm text-green-200 mt-4">
                ⏱️ 약 3분 소요 • 📚 5단계 학습 • 🧼 클린룸의 모든 것
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="mb-4 flex-shrink-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">
                    Step {theoryStep + 1} / {theorySteps.length}
                  </span>
                  <span className="text-sm text-green-200">
                    {Math.round(((theoryStep + 1) / theorySteps.length) * 100)}% 완료
                  </span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((theoryStep + 1) / theorySteps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Content area - Left SVG + Right Text */}
              <div className="flex-1 min-h-0 flex gap-4 mb-4">
                <div className="w-1/2 flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                  {getTheorySVG(theoryStep)}
                </div>
                <div ref={storyContentRef} className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm rounded-xl p-6 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{theorySteps[theoryStep].icon}</span>
                    <h3 className="text-xl font-bold">
                      {theorySteps[theoryStep].title}
                    </h3>
                  </div>

                  <div className="text-base leading-relaxed whitespace-pre-line mb-4 font-medium">
                    {typedText}
                    {typedText.length < theorySteps[theoryStep].content.length && (
                      <span className="inline-block w-2 h-6 bg-white ml-1 animate-pulse" />
                    )}
                  </div>

                  {typedText.length >= theorySteps[theoryStep].content.length && (
                    <div className="mt-4 p-3 bg-yellow-400/20 border-2 border-yellow-300 rounded-lg transition-all duration-500 opacity-100">
                      <div className="flex items-start gap-2 text-yellow-300">
                        <LightbulbIcon />
                        <p className="text-yellow-100 font-semibold text-sm">
                          {theorySteps[theoryStep].highlight}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between flex-shrink-0">
                <button
                  onClick={prevTheoryStep}
                  disabled={theoryStep === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    theoryStep === 0
                      ? 'bg-white/20 text-white/50 cursor-not-allowed'
                      : 'bg-white/30 text-white hover:bg-white/40'
                  }`}
                >
                  ← 이전
                </button>

                <button
                  onClick={stopTheoryAnimation}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all font-semibold"
                >
                  <PauseIcon />
                  일시정지
                </button>

                {theoryStep < theorySteps.length - 1 ? (
                  <button
                    onClick={nextTheoryStep}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-yellow-50 transition-all font-semibold shadow-lg"
                  >
                    다음 →
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('overview')}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-all font-semibold shadow-lg animate-pulse"
                  >
                    시뮬레이터 시작! 🚀
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <button
            onClick={() => setShowDetailedTheory(false)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4"
          >
            ← 오프닝으로 돌아가기
          </button>
          <div className="prose max-w-none">
            <h3 className="text-2xl font-bold mb-4">상세 이론</h3>
            <p>상세 이론 내용이 여기에 들어갑니다.</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* 상단 탭 네비게이션 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 컨텐츠 영역 */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === 'theory' && <TheoryTab />}
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'wet-cleaning' && <WetCleaningTab />}
          {activeTab === 'dry-cleaning' && <DryCleaningTab />}
          {activeTab === 'ultrasonic' && <UltrasonicTab />}
          {activeTab === 'quiz' && <QuizTab />}
        </div>
      </div>
    </div>
  );
};

export default CleaningSimulator;
