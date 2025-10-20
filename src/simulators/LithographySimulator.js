import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PhotolithographySimulator = () => {
  const [activeTab, setActiveTab] = useState('overview1');
  const [processStep, setProcessStep] = useState(0);
  const [prType, setPrType] = useState('positive');
  const [maskType, setMaskType] = useState('binary');
  const [exposureType, setExposureType] = useState('contact');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  
  // 공정 애니메이션 상태 추가
  const [animationStep, setAnimationStep] = useState(0);
  
  // 공정 파라미터들
  const [processParams, setProcessParams] = useState({
    step1_rpm: 500,
    step1_time: 6,
    step2_rpm: 3000,
    step2_time: 30,
    step3_rpm: 0,
    step3_time: 2
  });

  // 결과 데이터
  const [processResults, setProcessResults] = useState({
    prThickness: 0,
    resolution: 0,
    uniformity: 0,
    defectDensity: 0,
    cdUniformity: 0
  });

  // 퀴즈 관련 상태
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const tabs = [
    { id: 'overview1', name: '포토리소그라피 공정 개요1', icon: '📋' },
    { id: 'overview2', name: '포토리소그라피 공정 개요2', icon: '📷' },
    { id: 'process', name: 'PR Coating 공정', icon: '⚙️' },
    { id: 'exposure', name: '노광 방식 비교', icon: '💡' },
    { id: 'quiz', name: '학습 평가', icon: '📝' }
  ];

  const processSteps = [
    { id: 0, name: '광원 준비', description: 'UV 광원(365nm)에서 정밀한 자외선을 조사합니다' },
    { id: 1, name: '마스크 정렬', description: '크롬 패턴 마스크를 웨이퍼와 정렬합니다' },
    { id: 2, name: 'PR 도포 웨이퍼', description: '포토레지스트가 이미 도포된 웨이퍼를 준비합니다' },
    { id: 3, name: '선택적 노광', description: '마스크 패턴에 따른 UV 광 조사로 PR 화학변화' },
    { id: 4, name: '현상', description: 'TMAH 현상액으로 노광부를 제거하여 패턴 형성' }
  ];

  const quizQuestions = [
    {
      question: "스핀 코팅에서 2단계 RPM을 1500에서 4000으로 증가시킬 때 예상되는 결과는?",
      options: ["PR 두께 증가, 균일도 향상", "PR 두께 감소, 균일도 향상", "PR 두께 증가, 균일도 저하", "PR 두께 감소, 균일도 저하"],
      correct: 1
    },
    {
      question: "Dehydration Bake (150-200°C)와 HMDS 처리 (100°C)의 온도 차이가 나는 이유는?",
      options: ["단순히 공정 순서상의 차이", "물의 끓는점을 고려한 물리적 제거 vs 화학적 결합", "장비의 성능 차이", "PR 종류에 따른 차이"],
      correct: 1
    },
    {
      question: "PSM(Phase Shift Mask)이 0.18μm 이하 공정에서 필요한 근본적인 이유는?",
      options: ["제조 비용 절약", "광 파장(365nm)보다 작은 패턴에서 회절 현상 심화", "마스크 수명 연장", "노광 시간 단축"],
      correct: 1
    },
    {
      question: "PEB 공정에서 온도를 유리전이온도(Tg) 이상으로 설정하는 이유는?",
      options: ["PR을 완전히 제거하기 위해", "분자 유동성을 높여 Standing Wave를 제거하기 위해", "노광 속도를 향상시키기 위해", "웨이퍼 접착력을 약화시키기 위해"],
      correct: 1
    },
    {
      question: "EUV 시스템이 DUV 대비 '낮은 처리량(throughput)'을 갖는 주된 기술적 원인은?",
      options: ["13.5nm 파장이 너무 짧아서", "반사형 미러 시스템의 복잡성", "단일패터닝으로 인한 공정 단순화", "플라즈마 광원의 낮은 출력"],
      correct: 3
    },
    {
      question: "Hard Bake(120-140°C)가 Soft Bake(100°C)보다 높은 온도에서 수행되는 목적은?",
      options: ["현상 속도 향상", "노광 감도 증가", "식각 공정 대비 완전 경화", "PR 제거 용이성"],
      correct: 2
    },
    {
      question: "Scanner 방식이 Stepper 방식보다 '수차 최소화'에 유리한 이유는?",
      options: ["렌즈 크기가 더 크기 때문", "스캔 과정에서 렌즈 중심부만 주로 사용하기 때문", "노광 시간이 길기 때문", "레티클 크기가 작기 때문"],
      correct: 1
    },
    {
      question: "1단계 Spread의 최적 조건이 '400-600 RPM, 4초 이상'인 이유를 가장 잘 설명한 것은?",
      options: ["높은 RPM으로 빠른 코팅 완료", "낮은 RPM으로 PR 절약", "중간 속도로 균일한 분산 + 충분한 시간 확보", "최고 속도로 최대 처리량 달성"],
      correct: 2
    },
    {
      question: "WEE(Wafer Edge Exposure)가 EBR과 다른 점은?",
      options: ["WEE는 코팅 전, EBR은 코팅 후", "WEE는 노광+PEB 후, EBR은 코팅 직후", "WEE는 화학적, EBR은 물리적 제거", "본질적으로 같은 공정"],
      correct: 1
    },
    {
      question: "포토리소그라피가 '유일하게 재작업 가능한 반도체 공정'인 이유는?",
      options: ["PR 재료가 저렴하기 때문", "감광막을 완전 제거 후 재진행이 가능하기 때문", "노광 장비가 정밀하기 때문", "패턴이 표면에만 형성되기 때문"],
      correct: 1
    }
  ];

  // Recipe 단계별 데이터 생성 함수
  const generateRecipeProfile = () => {
    const { step1_rpm, step1_time, step2_rpm, step2_time, step3_rpm, step3_time } = processParams;
    
    return [
      { time: 0, rpm: 0, step: 'Start' },
      { time: 1, rpm: step1_rpm, step: 'Spread' },
      { time: 1 + step1_time, rpm: step1_rpm, step: 'Spread' },
      { time: 2 + step1_time, rpm: step2_rpm, step: 'Spin' },
      { time: 2 + step1_time + step2_time, rpm: step2_rpm, step: 'Spin' },
      { time: 3 + step1_time + step2_time, rpm: step3_rpm, step: 'Stop' },
      { time: 3 + step1_time + step2_time + step3_time, rpm: step3_rpm, step: 'Stop' }
    ];
  };

  // 공정 실행 함수
  const runProcess = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    
    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          calculateResults();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  // 결과 계산 함수
  const calculateResults = () => {
    const { step1_rpm, step1_time, step2_rpm, step2_time, step3_rpm, step3_time } = processParams;
    
    // 두께 계산 (2단계 RPM에 주로 의존, 기본 1000nm 목표)
    let thickness = 1000; // 기본 목표 두께
    
    // RPM에 따른 두께 변화 (편차를 100nm 수준으로 조정)
    if (step2_rpm < 2000) {
      thickness = 1000 + (2000 - step2_rpm) * 0.1; // 저속일 때 두꺼워짐 (최대 +100nm)
    } else if (step2_rpm > 4000) {
      thickness = 1000 - (step2_rpm - 4000) * 0.05; // 고속일 때 얇아짐 (최대 -100nm)
    } else {
      // 최적 범위(2000-4000)에서는 목표 두께 근처
      thickness = 1000 + (Math.random() - 0.5) * 20; // ±10nm 내외
    }
    
    // 균일도 계산 (기본 99%, 조건에 따라 감소)
    let uniformity = 99; // 기본 우수한 균일도
    
    // 1단계 영향: PR 분산 효과
    if (step1_rpm >= 400 && step1_rpm <= 600 && step1_time >= 4) {
      uniformity += 0; // 최적 조건 유지
    } else {
      if (step1_rpm < 300) uniformity -= 8; // 너무 낮음
      else if (step1_rpm > 800) uniformity -= 6; // 너무 높음
      else uniformity -= 3; // 약간 벗어남
      
      if (step1_time < 4) uniformity -= 4; // 시간 부족
    }
    
    // 2단계 영향: 가장 중요한 단계
    if (step2_rpm >= 2500 && step2_rpm <= 3500 && step2_time >= 20) {
      uniformity += 0; // 최적 조건
    } else {
      // RPM 영향
      if (step2_rpm < 1500) uniformity -= 15; // 매우 낮음
      else if (step2_rpm < 2000) uniformity -= 8; // 낮음
      else if (step2_rpm > 5000) uniformity -= 12; // 매우 높음
      else if (step2_rpm > 4500) uniformity -= 6; // 높음
      else uniformity -= 2; // 약간 벗어남
      
      // 시간 영향
      if (step2_time < 15) uniformity -= 5; // 시간 부족
      else if (step2_time > 50) uniformity -= 3; // 과도한 시간
    }
    
    // 3단계 영향: 안정화
    if (step3_rpm === 0 && step3_time >= 2) {
      uniformity += 0; // 최적 조건
    } else {
      if (step3_rpm > 0) uniformity -= 2; // 완전 정지 아님
      if (step3_time < 2) uniformity -= 1; // 안정화 시간 부족
    }
    
    // 최종 균일도 범위 제한
    uniformity = Math.min(99.5, Math.max(70, uniformity));
    
    // 해상도 (PR 코팅과 직접 관련 없으므로 고정값)
    const resolution = 88 + Math.random() * 4; // 88-92% 범위
    
    // 결함 밀도 (균일도와 반비례)
    const defectDensity = Math.max(0.1, (100 - uniformity) * 0.15);
    
    // CD 균일도
    const cdUniformity = Math.min(100, (uniformity + resolution) / 2);

    setProcessResults({
      prThickness: thickness,
      resolution,
      uniformity,
      defectDensity,
      cdUniformity
    });
  };

  const submitAnswer = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct.toString()) {
      setScore(score + 1);
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview1':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">📋 포토리소그라피 상세 공정 개요</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                포토리소그라피는 <strong>8단계의 정밀한 공정</strong>으로 구성되어 있습니다. 
                각 단계마다 고유한 목적과 중요한 기술적 요소들이 있으며, 모든 과정이 유기적으로 연결되어 완벽한 패턴을 형성합니다.
              </p>
              <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                💡 <strong>핵심 포인트:</strong> 포토 공정은 모든 반도체 공정 중 유일하게 재작업이 가능한 공정입니다!
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-6">8단계 포토리소그라피 공정 흐름</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { step: '1', name: 'Vapor Prime', color: 'bg-red-50 border-red-200', icon: '🔥' },
                  { step: '2', name: 'Spin Coating', color: 'bg-blue-50 border-blue-200', icon: '🌀' },
                  { step: '3', name: 'Soft Bake', color: 'bg-orange-50 border-orange-200', icon: '♨️' },
                  { step: '4', name: 'Align & Exposure', color: 'bg-purple-50 border-purple-200', icon: '💡' },
                  { step: '5', name: 'PEB', color: 'bg-green-50 border-green-200', icon: '🔥' },
                  { step: '6', name: 'Develop', color: 'bg-cyan-50 border-cyan-200', icon: '🧪' },
                  { step: '7', name: 'Hard Bake', color: 'bg-yellow-50 border-yellow-200', icon: '♨️' },
                  { step: '8', name: 'Inspection', color: 'bg-pink-50 border-pink-200', icon: '🔍' }
                ].map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg border-2 ${item.color} text-center`}>
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-bold text-sm">Step {item.step}</div>
                    <div className="text-xs text-gray-600">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Step 1: Vapor Prime */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-400">
                <h4 className="text-lg font-semibold text-red-800 mb-4">🔥 Step 1: Vapor Prime (표면 전처리)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">공정 목적</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      산화되어 <strong>친수성이 된 웨이퍼</strong>를 <strong>소수성으로 변환</strong>하여 
                      포토레지스트의 접착력을 향상시키는 핵심 전처리 공정입니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h6 className="font-semibold text-red-800 mb-2">1-1. Dehydration Bake</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>온도:</strong> 150~200°C (물의 끓는점 이상)</li>
                          <li>• <strong>목적:</strong> 웨이퍼 표면 수분 제거</li>
                          <li>• <strong>원리:</strong> 물리적 결합 수분을 열에너지로 증발</li>
                          <li>• <strong>특징:</strong> 일부 공정에서는 생략 가능</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h6 className="font-semibold text-orange-800 mb-2">1-2. HMDS 처리</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>온도:</strong> 약 100°C</li>
                          <li>• <strong>목적:</strong> 완전한 표면 소수성 확보</li>
                          <li>• <strong>원리:</strong> OH기와 화학반응으로 소수성 분자 결합</li>
                          <li>• <strong>효과:</strong> PR 접착력 극대화</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="400" height="200" viewBox="0 0 400 200">
                      {/* Before - 좌측 실리콘 웨이퍼 */}
                      <rect x="30" y="120" width="100" height="30" fill="#4a5568" />
                      <text x="80" y="140" textAnchor="middle" className="text-sm font-bold fill-white">Silicon Wafer</text>
                      
                      {/* 친수성 표면 (파란색 H2O 분자들) */}
                      <g>
                        <circle cx="40" cy="110" r="4" fill="#3b82f6" fillOpacity="0.7" />
                        <circle cx="60" cy="115" r="4" fill="#3b82f6" fillOpacity="0.7" />
                        <circle cx="80" cy="108" r="4" fill="#3b82f6" fillOpacity="0.7" />
                        <circle cx="100" cy="112" r="4" fill="#3b82f6" fillOpacity="0.7" />
                        <circle cx="120" cy="107" r="4" fill="#3b82f6" fillOpacity="0.7" />
                        <text x="80" y="95" textAnchor="middle" className="text-xs fill-blue-600">H₂O 분자 (친수성)</text>
                      </g>
                      
                      {/* 오른쪽 화살표 */}
                      <path d="M 150 135 L 210 135 M 200 125 L 210 135 L 200 145" stroke="#ef4444" strokeWidth="3" fill="none" />
                      <text x="180" y="125" textAnchor="middle" className="text-sm font-bold fill-red-600">HMDS 처리</text>
                      
                      {/* After - 우측 실리콘 웨이퍼 */}
                      <rect x="230" y="120" width="100" height="30" fill="#4a5568" />
                      <text x="280" y="140" textAnchor="middle" className="text-sm font-bold fill-white">Silicon Wafer</text>
                      
                      {/* 소수성 표면 (초록색 HMDS 분자들) */}
                      <g>
                        <circle cx="240" cy="110" r="4" fill="#10b981" fillOpacity="0.8" />
                        <circle cx="260" cy="115" r="4" fill="#10b981" fillOpacity="0.8" />
                        <circle cx="280" cy="108" r="4" fill="#10b981" fillOpacity="0.8" />
                        <circle cx="300" cy="112" r="4" fill="#10b981" fillOpacity="0.8" />
                        <circle cx="320" cy="107" r="4" fill="#10b981" fillOpacity="0.8" />
                        <text x="280" y="95" textAnchor="middle" className="text-xs fill-green-600">HMDS 분자 (소수성)</text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 2: Spin Coating */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-400">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">🌀 Step 2: Spin Coating (PR 도포)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">공정 개요</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      Spin Coater 위에 놓인 웨이퍼에 <strong>포토레지스트를 떨어트린 후</strong> 
                      회전시켜 균일하게 코팅하는 공정입니다.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h6 className="font-semibold text-blue-800 mb-2">RPM과 두께의 관계</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>고속 회전 (3000+ RPM):</strong> 얇은 PR 층</li>
                          <li>• <strong>저속 회전 (1000- RPM):</strong> 두꺼운 PR 층</li>
                          <li>• <strong>목표:</strong> 웨이퍼 전체에 균일한 두께</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h6 className="font-semibold text-yellow-800 mb-2">문제점과 해결책</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>문제:</strong> 가장자리가 두껍게 도포됨</li>
                          <li>• <strong>해결:</strong> EBR (Edge Bead Removal)</li>
                          <li>• <strong>방법:</strong> 신너 용액으로 가장자리 제거</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="250" height="200" viewBox="0 0 250 200">
                      {/* 스핀 코터 */}
                      <circle cx="125" cy="100" r="60" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2" />
                      <circle cx="125" cy="100" r="50" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                      <text x="125" y="105" textAnchor="middle" className="text-sm font-bold fill-white">Wafer</text>
                      
                      {/* PR 드롭 */}
                      <circle cx="125" cy="70" r="8" fill="#ef4444" />
                      <text x="125" y="55" textAnchor="middle" className="text-xs font-bold fill-red-600">PR Drop</text>
                      
                      {/* 회전 화살표 */}
                      <path d="M 90 75 A 25 25 0 0 1 115 50" stroke="#10b981" strokeWidth="3" fill="none" />
                      <path d="M 160 75 A 25 25 0 0 0 135 50" stroke="#10b981" strokeWidth="3" fill="none" />
                      
                      <text x="50" y="40" className="text-sm font-bold fill-green-600">RPM</text>
                      
                      {/* Edge Bead */}
                      <ellipse cx="125" cy="100" rx="55" ry="55" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="5,5" />
                      <text x="190" y="100" className="text-xs fill-orange-600">Edge Bead</text>
                    </svg>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h5 className="font-semibold text-gray-800 mb-3">EBR (Edge Bead Removal) 공정</h5>
                  <div className="flex justify-center">
                    <svg width="400" height="150" viewBox="0 0 400 150">
                      {/* Before - 왼쪽 측면도 */}
                      <g>
                        {/* Wafer 기판 */}
                        <rect x="20" y="90" width="120" height="20" fill="#4a5568" />
                        <text x="80" y="125" textAnchor="middle" className="text-xs font-bold fill-gray-600">Wafer</text>
                        
                        {/* PR 층 - 가장자리가 두꺼움 */}
                        <path d="M 20 90 Q 30 75 50 80 L 110 80 Q 130 75 140 90" 
                              fill="#3b82f6" />
                        <text x="80" y="70" textAnchor="middle" className="text-xs fill-blue-600">PR (Edge Bead)</text>
                        <text x="80" y="60" textAnchor="middle" className="text-xs font-bold">Before</text>
                      </g>
                      
                      {/* EBR 화살표와 텍스트 */}
                      <g>
                        <path d="M 170 85 L 230 85 M 220 75 L 230 85 L 220 95" stroke="#ef4444" strokeWidth="3" fill="none" />
                        <text x="200" y="105" textAnchor="middle" className="text-sm font-bold fill-red-600">EBR</text>
                      </g>
                      
                      {/* After - 오른쪽 측면도 */}
                      <g>
                        {/* Wafer 기판 */}
                        <rect x="260" y="90" width="120" height="20" fill="#4a5568" />
                        <text x="320" y="125" textAnchor="middle" className="text-xs font-bold fill-gray-600">Wafer</text>
                        
                        {/* PR 층 - 플랫하게 */}
                        <rect x="260" y="80" width="120" height="10" fill="#3b82f6" />
                        <text x="320" y="75" textAnchor="middle" className="text-xs fill-blue-600">Uniform PR</text>
                        <text x="320" y="60" textAnchor="middle" className="text-xs font-bold">After</text>
                      </g>
                      
                      {/* 하단 설명 */}
                      <text x="200" y="145" textAnchor="middle" className="text-sm font-bold fill-gray-700">Edge Bead Removal을 통한 균일한 PR 두께 확보</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 3: Soft Bake */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-400">
                <h4 className="text-lg font-semibold text-orange-800 mb-4">♨️ Step 3: Soft Bake (용매 제거)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">공정 목적</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      PR 내 <strong>용매(Solvent) 제거</strong>를 통해 노광 공정에 대비하고 
                      PR을 고형화시키는 중요한 열처리 공정입니다.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h6 className="font-semibold text-orange-800 mb-2">공정 조건</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>온도:</strong> 약 100°C</li>
                          <li>• <strong>시간:</strong> 2~3분</li>
                          <li>• <strong>방법:</strong> 적외선 노출</li>
                          <li>• <strong>장비:</strong> 트랙 장비 내 오븐</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h6 className="font-semibold text-red-800 mb-2">주요 효과</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>용매 제거:</strong> 80~90wt% → 거의 0%</li>
                          <li>• <strong>PR 고형화:</strong> 웨이퍼 접착력 향상</li>
                          <li>• <strong>구조 강화:</strong> 현상 시 패턴 보호</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="250" height="200" viewBox="0 0 250 200">
                      {/* Before */}
                      <g>
                        <rect x="30" y="60" width="80" height="15" fill="#3b82f6" />
                        <rect x="30" y="75" width="80" height="20" fill="#4a5568" />
                        <text x="70" y="105" textAnchor="middle" className="text-xs font-bold">Before</text>
                        
                        {/* 용매 분자들 */}
                        <circle cx="40" cy="67" r="2" fill="#fbbf24" />
                        <circle cx="55" cy="65" r="2" fill="#fbbf24" />
                        <circle cx="70" cy="68" r="2" fill="#fbbf24" />
                        <circle cx="85" cy="66" r="2" fill="#fbbf24" />
                        <circle cx="100" cy="67" r="2" fill="#fbbf24" />
                        <text x="70" y="50" textAnchor="middle" className="text-xs">용매 80-90%</text>
                      </g>
                      
                      {/* 열처리 화살표 */}
                      <g>
                        <path d="M 125 70 L 155 70 M 150 65 L 155 70 L 150 75" stroke="#ef4444" strokeWidth="3" fill="none" />
                        <text x="140" y="90" textAnchor="middle" className="text-xs font-bold fill-red-600">100°C</text>
                        <text x="140" y="105" textAnchor="middle" className="text-xs font-bold fill-red-600">Heat</text>
                        
                        {/* 증발하는 용매 */}
                        <circle cx="130" cy="45" r="1.5" fill="#fbbf24" fillOpacity="0.5" />
                        <circle cx="140" cy="40" r="1.5" fill="#fbbf24" fillOpacity="0.5" />
                        <circle cx="150" cy="35" r="1.5" fill="#fbbf24" fillOpacity="0.5" />
                        <path d="M 130 50 L 130 40 M 140 55 L 140 45 M 150 50 L 150 40" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2,2" />
                      </g>
                      
                      {/* After */}
                      <g>
                        <rect x="170" y="60" width="80" height="15" fill="#3b82f6" />
                        <rect x="170" y="75" width="80" height="20" fill="#4a5568" />
                        <text x="210" y="105" textAnchor="middle" className="text-xs font-bold">After</text>
                        <text x="210" y="50" textAnchor="middle" className="text-xs">고형 PR 필름</text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 4: Align and Exposure */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-400">
                <h4 className="text-lg font-semibold text-purple-800 mb-4">💡 Step 4: Align and Exposure (정렬 및 노광)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h5 className="font-semibold text-gray-800 mb-3">노광 방식의 진화</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      마스크의 회로 패턴을 웨이퍼로 전사하는 핵심 공정으로, 
                      <strong>접촉 → 근접 → 투영 → 액침</strong> 방식으로 발전했습니다.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h6 className="font-semibold text-purple-800 mb-2">접촉 방식</h6>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• <strong>장점:</strong> 매우 높은 해상도</li>
                            <li>• <strong>단점:</strong> 마스크 마모, 파티클 증가</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h6 className="font-semibold text-blue-800 mb-2">근접 방식</h6>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• <strong>특징:</strong> 마스크와 웨이퍼 간격</li>
                            <li>• <strong>문제:</strong> 회절로 인한 해상도 저하</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h6 className="font-semibold text-green-800 mb-2">투영 방식</h6>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• <strong>특징:</strong> 렌즈를 이용한 축소 투영</li>
                            <li>• <strong>장점:</strong> 마스크 보호, 높은 처리량</li>
                          </ul>
                        </div>
                        
                        <div className="p-3 bg-cyan-50 rounded-lg">
                          <h6 className="font-semibold text-cyan-800 mb-2">액침 방식</h6>
                          <ul className="text-xs space-y-1 text-gray-700">
                            <li>• <strong>매질:</strong> 물(굴절률 1.44)</li>
                            <li>• <strong>효과:</strong> 40% 해상도 향상</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="200" height="250" viewBox="0 0 200 250">
                      {/* UV Light */}
                      <g>
                        <circle cx="100" cy="30" r="15" fill="#fbbf24" />
                        <text x="100" y="36" textAnchor="middle" className="text-xs font-bold">UV</text>
                        <path d="M 85 45 L 85 70 M 80 65 L 85 70 L 90 65" stroke="#fbbf24" strokeWidth="2" fill="none" />
                        <path d="M 100 45 L 100 70 M 95 65 L 100 70 L 105 65" stroke="#fbbf24" strokeWidth="2" fill="none" />
                        <path d="M 115 45 L 115 70 M 110 65 L 115 70 L 120 65" stroke="#fbbf24" strokeWidth="2" fill="none" />
                      </g>
                      
                      {/* Lens */}
                      <ellipse cx="100" cy="80" rx="30" ry="8" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                      <text x="140" y="85" className="text-xs">Lens</text>
                      
                      {/* Mask */}
                      <rect x="70" y="110" width="60" height="8" fill="#a855f7" />
                      <rect x="75" y="110" width="8" height="8" fill="#fbbf24" />
                      <rect x="88" y="110" width="8" height="8" fill="#fbbf24" />
                      <rect x="104" y="110" width="8" height="8" fill="#fbbf24" />
                      <rect x="117" y="110" width="8" height="8" fill="#fbbf24" />
                      <text x="140" y="118" className="text-xs">Mask</text>
                      
                      {/* Projection Lens */}
                      <ellipse cx="100" cy="140" rx="25" ry="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                      <ellipse cx="100" cy="155" rx="20" ry="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                      <ellipse cx="100" cy="170" rx="25" ry="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                      <text x="140" y="155" className="text-xs">Projection</text>
                      
                      {/* Immersion */}
                      <rect x="80" y="180" width="40" height="10" fill="#06b6d4" fillOpacity="0.6" />
                      <text x="140" y="188" className="text-xs">Water</text>
                      
                      {/* Wafer */}
                      <rect x="70" y="200" width="60" height="8" fill="#22c55e" />
                      <rect x="70" y="208" width="60" height="12" fill="#4a5568" />
                      <text x="100" y="235" textAnchor="middle" className="text-xs">Wafer</text>
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h6 className="font-semibold text-red-800 mb-2">⚠️ Align 불량 시 문제점</h6>
                  <div className="text-sm text-gray-700">
                    <p><strong>저항 증가:</strong> Contact & Metal, Contact & Source/Drain의 접촉 면적 감소로 인한 전기적 성능 저하</p>
                  </div>
                </div>
              </div>

              {/* Step 5: PEB */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-400">
                <h4 className="text-lg font-semibold text-green-800 mb-4">🔥 Step 5: PEB (Post Exposure Bake)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">공정 목적</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      노광 직후 발생하는 <strong>정재파(Standing Wave) 제거</strong>와 
                      <strong>PAC(Photo Active Compound) 활성화</strong>를 통한 노광 품질 향상
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h6 className="font-semibold text-green-800 mb-2">핵심 개념</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>정재파:</strong> 빛의 간섭으로 생긴 감광 계면 결</li>
                          <li>• <strong>유리전이온도:</strong> 고체→고무상태 전환점</li>
                          <li>• <strong>PAC 활성화:</strong> 빛 활성제의 화학반응 촉진</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h6 className="font-semibold text-blue-800 mb-2">온도 효과 (T > Tg)</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>분자 유동성 향상</strong></li>
                          <li>• <strong>노광 분자 재배치</strong></li>
                          <li>• <strong>해상도 개선</strong></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="400" height="200" viewBox="0 0 400 200">
                      {/* 기준선 */}
                      <line x1="0" y1="180" x2="400" y2="180" stroke="#000" strokeWidth="3" />
                      
                      {/* Before - 왼쪽 직사각형 패턴 + 측면 돌기들 */}
                      <g>
                        <rect x="60" y="120" width="80" height="60" fill="#6b7280" />
                        
                        {/* 왼쪽 측면 돌기들 */}
                        <circle cx="60" cy="130" r="4" fill="#6b7280" />
                        <circle cx="60" cy="145" r="4" fill="#6b7280" />
                        <circle cx="60" cy="160" r="4" fill="#6b7280" />
                        <circle cx="60" cy="175" r="4" fill="#6b7280" />
                        
                        {/* 오른쪽 측면 돌기들 */}
                        <circle cx="140" cy="125" r="4" fill="#6b7280" />
                        <circle cx="140" cy="140" r="4" fill="#6b7280" />
                        <circle cx="140" cy="155" r="4" fill="#6b7280" />
                        <circle cx="140" cy="170" r="4" fill="#6b7280" />
                      </g>
                      
                      {/* Bake 화살표와 텍스트 */}
                      <g>
                        <path d="M 170 140 L 230 140 M 220 130 L 230 140 L 220 150" stroke="#9ca3af" strokeWidth="4" fill="none" />
                        <text x="200" y="125" textAnchor="middle" className="text-xl font-bold fill-gray-600">Bake</text>
                      </g>
                      
                      {/* After - 오른쪽 매끄러운 직사각형 패턴 */}
                      <g>
                        <rect x="260" y="120" width="80" height="60" fill="#6b7280" />
                      </g>
                      
                      {/* 하단 설명 */}
                      <text x="200" y="195" textAnchor="middle" className="text-sm font-bold fill-gray-700">PEB를 통한 Standing Wave 제거</text>
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h6 className="font-semibold text-yellow-800 mb-2">WEE (Wafer Edge Exposure)</h6>
                  <div className="text-sm text-gray-700">
                    <p>EBR과 달리 노광 완료 후 PEB를 거쳐 <strong>웨이퍼 가장자리의 PR을 제거</strong>하는 공정 (웨이퍼 윗면만 처리)</p>
                  </div>
                </div>
              </div>

              {/* Step 6: Develop */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-cyan-400">
                <h4 className="text-lg font-semibold text-cyan-800 mb-4">🧪 Step 6: Develop (현상)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">공정 원리</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      <strong>알칼리 수용액(TMAH)</strong>을 사용하여 화학반응을 통해 
                      제거하고자 하는 PR을 선택적으로 제거하는 핵심 공정입니다.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-cyan-50 rounded-lg">
                        <h6 className="font-semibold text-cyan-800 mb-2">현상액 특성</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>주성분:</strong> TMAH (Tetramethylammonium hydroxide)</li>
                          <li>• <strong>성질:</strong> 알칼리성 수용액</li>
                          <li>• <strong>작용:</strong> 화학적 선택 제거</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h6 className="font-semibold text-blue-800 mb-2">공정 후 처리</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>잔여물 제거:</strong> 회전세척</li>
                          <li>• <strong>린스:</strong> DI-Water로 현상액 제거</li>
                          <li>• <strong>건조:</strong> 스핀 드라이</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="250" height="200" viewBox="0 0 250 200">
                      {/* Before Develop */}
                      <g>
                        <rect x="30" y="70" width="80" height="15" fill="#3b82f6" />
                        <rect x="30" y="85" width="80" height="15" fill="#4a5568" />
                        <text x="70" y="115" textAnchor="middle" className="text-xs font-bold">Before</text>
                        
                        {/* 노광된 영역 표시 */}
                        <rect x="40" y="70" width="15" height="15" fill="#ff9999" />
                        <rect x="65" y="70" width="15" height="15" fill="#ff9999" />
                        <rect x="90" y="70" width="15" height="15" fill="#ff9999" />
                        <text x="70" y="60" textAnchor="middle" className="text-xs">노광된 PR</text>
                      </g>
                      
                      {/* 현상액 */}
                      <g>
                        <path d="M 125 78 L 155 78 M 150 73 L 155 78 L 150 83" stroke="#06b6d4" strokeWidth="3" fill="none" />
                        <text x="140" y="95" textAnchor="middle" className="text-xs font-bold fill-cyan-600">TMAH</text>
                        <text x="140" y="110" textAnchor="middle" className="text-xs font-bold fill-cyan-600">현상액</text>
                        
                        {/* 화학반응 표시 */}
                        <circle cx="130" cy="65" r="3" fill="#06b6d4" fillOpacity="0.5" />
                        <circle cx="145" cy="68" r="3" fill="#06b6d4" fillOpacity="0.5" />
                        <circle cx="140" cy="55" r="3" fill="#06b6d4" fillOpacity="0.5" />
                      </g>
                      
                      {/* After Develop */}
                      <g>
                        <rect x="170" y="85" width="80" height="15" fill="#4a5568" />
                        <text x="210" y="115" textAnchor="middle" className="text-xs font-bold">After</text>
                        
                        {/* 패턴 형성 */}
                        <rect x="175" y="70" width="12" height="15" fill="#3b82f6" />
                        <rect x="195" y="70" width="15" height="15" fill="#3b82f6" />
                        <rect x="220" y="70" width="12" height="15" fill="#3b82f6" />
                        <rect x="240" y="70" width="8" height="15" fill="#3b82f6" />
                        <text x="210" y="60" textAnchor="middle" className="text-xs fill-blue-600">패턴 형성</text>
                      </g>
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>💡 핵심:</strong> 현상되지 않고 남아있는 PR은 다음 식각 공정에서 하부 필름을 보호하는 마스크 역할을 수행합니다.
                  </p>
                </div>
              </div>

              {/* Step 7: Hard Bake */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
                <h4 className="text-lg font-semibold text-yellow-800 mb-4">♨️ Step 7: Hard Bake (경화)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">공정 목적</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      Soft Bake보다 <strong>높은 온도(120~140°C)</strong>로 베이크하여 
                      PR을 완전히 경화시키고 식각 공정에 대비하는 마무리 열처리입니다.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <h6 className="font-semibold text-yellow-800 mb-2">주요 효과</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>완전한 용매 제거:</strong> 잔여 solvent 증발</li>
                          <li>• <strong>결속력 강화:</strong> PR-웨이퍼 간 접착력 극대화</li>
                          <li>• <strong>식각 보호:</strong> 식각 시 PR 제거 방지</li>
                          <li>• <strong>수분 제거:</strong> 린스 시 DI-Water 건조</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <h6 className="font-semibold text-orange-800 mb-2">온도 비교</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>Soft Bake:</strong> ~100°C (용매 제거)</li>
                          <li>• <strong>Hard Bake:</strong> 120~140°C (완전 경화)</li>
                          <li>• <strong>목적:</strong> 최종 패턴 안정화</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="250" height="200" viewBox="0 0 250 200">
                      {/* Before Hard Bake */}
                      <g>
                        <rect x="30" y="85" width="80" height="15" fill="#4a5568" />
                        <rect x="35" y="70" width="12" height="15" fill="#3b82f6" fillOpacity="0.7" />
                        <rect x="55" y="70" width="15" height="15" fill="#3b82f6" fillOpacity="0.7" />
                        <rect x="80" y="70" width="12" height="15" fill="#3b82f6" fillOpacity="0.7" />
                        <rect x="100" y="70" width="8" height="15" fill="#3b82f6" fillOpacity="0.7" />
                        <text x="70" y="115" textAnchor="middle" className="text-xs font-bold">Before</text>
                        <text x="70" y="60" textAnchor="middle" className="text-xs">연성 PR</text>
                        
                        {/* 잔여 수분/용매 */}
                        <circle cx="45" cy="77" r="1.5" fill="#fbbf24" fillOpacity="0.6" />
                        <circle cx="65" cy="75" r="1.5" fill="#fbbf24" fillOpacity="0.6" />
                        <circle cx="85" cy="78" r="1.5" fill="#fbbf24" fillOpacity="0.6" />
                      </g>
                      
                      {/* Hard Bake */}
                      <g>
                        <path d="M 125 78 L 155 78 M 150 73 L 155 78 L 150 83" stroke="#f59e0b" strokeWidth="3" fill="none" />
                        <text x="140" y="95" textAnchor="middle" className="text-xs font-bold fill-orange-600">140°C</text>
                        <text x="140" y="110" textAnchor="middle" className="text-xs font-bold fill-orange-600">Hard Bake</text>
                        
                        {/* 강한 열 표시 */}
                        <path d="M 130 55 Q 135 45 130 35 Q 135 25 130 15" stroke="#f59e0b" strokeWidth="3" fill="none" />
                        <path d="M 140 55 Q 145 45 140 35 Q 145 25 140 15" stroke="#f59e0b" strokeWidth="3" fill="none" />
                        <path d="M 150 55 Q 155 45 150 35 Q 155 25 150 15" stroke="#f59e0b" strokeWidth="3" fill="none" />
                        
                        {/* 증발 */}
                        <circle cx="130" cy="45" r="1" fill="#fbbf24" fillOpacity="0.3" />
                        <circle cx="145" cy="40" r="1" fill="#fbbf24" fillOpacity="0.3" />
                        <circle cx="155" cy="35" r="1" fill="#fbbf24" fillOpacity="0.3" />
                      </g>
                      
                      {/* After Hard Bake */}
                      <g>
                        <rect x="170" y="85" width="80" height="15" fill="#4a5568" />
                        <rect x="175" y="70" width="12" height="15" fill="#1d4ed8" />
                        <rect x="195" y="70" width="15" height="15" fill="#1d4ed8" />
                        <rect x="220" y="70" width="12" height="15" fill="#1d4ed8" />
                        <rect x="240" y="70" width="8" height="15" fill="#1d4ed8" />
                        <text x="210" y="115" textAnchor="middle" className="text-xs font-bold">After</text>
                        <text x="210" y="60" textAnchor="middle" className="text-xs fill-blue-800">경화된 PR</text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 8: Develop Inspection */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-400">
                <h4 className="text-lg font-semibold text-pink-800 mb-4">🔍 Step 8: Develop Inspection (검사)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">검사의 중요성</h5>
                    <p className="text-sm text-gray-700 mb-4">
                      <strong>식각 공정 전 최종 검사</strong>로 미세 회로 패턴의 품질을 확인하고 
                      필요시 재작업을 결정하는 품질 관리의 핵심 단계입니다.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <h6 className="font-semibold text-pink-800 mb-2">검사 항목</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>패턴 치수:</strong> CD (Critical Dimension)</li>
                          <li>• <strong>패턴 형상:</strong> 프로파일, 직각도</li>
                          <li>• <strong>결함 검출:</strong> 브리지, 오픈, 잔여물</li>
                          <li>• <strong>정렬 정확도:</strong> 오버레이 측정</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h6 className="font-semibold text-green-800 mb-2">재작업 가능성</h6>
                        <ul className="text-xs space-y-1 text-gray-700">
                          <li>• <strong>유일한 재작업 공정:</strong> 포토 공정만 가능</li>
                          <li>• <strong>방법:</strong> 감광막 완전 제거 후 재진행</li>
                          <li>• <strong>경제성:</strong> 웨이퍼 폐기보다 비용 효율적</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <svg width="250" height="200" viewBox="0 0 250 200">
                      {/* 검사 장비 */}
                      <rect x="100" y="30" width="50" height="30" fill="#6b7280" stroke="#374151" strokeWidth="2" />
                      <circle cx="125" cy="45" r="8" fill="#3b82f6" />
                      <text x="125" y="50" textAnchor="middle" className="text-xs font-bold fill-white">LENS</text>
                      <text x="125" y="20" textAnchor="middle" className="text-xs font-bold">검사 장비</text>
                      
                      {/* 검사 빛 */}
                      <path d="M 115 60 L 115 85 M 110 80 L 115 85 L 120 80" stroke="#fbbf24" strokeWidth="2" fill="none" />
                      <path d="M 125 60 L 125 85 M 120 80 L 125 85 L 130 80" stroke="#fbbf24" strokeWidth="2" fill="none" />
                      <path d="M 135 60 L 135 85 M 130 80 L 135 85 L 140 80" stroke="#fbbf24" strokeWidth="2" fill="none" />
                      
                      {/* 웨이퍼 패턴 */}
                      <rect x="80" y="100" width="90" height="15" fill="#4a5568" />
                      <rect x="85" y="85" width="10" height="15" fill="#3b82f6" />
                      <rect x="105" y="85" width="12" height="15" fill="#3b82f6" />
                      <rect x="127" y="85" width="10" height="15" fill="#3b82f6" />
                      <rect x="147" y="85" width="8" height="15" fill="#3b82f6" />
                      <rect x="165" y="85" width="5" height="15" fill="#3b82f6" />
                      <text x="125" y="130" textAnchor="middle" className="text-xs font-bold">패턴된 웨이퍼</text>
                      
                      {/* 검사 결과 */}
                      <g>
                        <rect x="30" y="150" width="60" height="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                        <text x="60" y="170" textAnchor="middle" className="text-xs font-bold fill-green-700">PASS</text>
                        
                        <rect x="160" y="150" width="60" height="30" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
                        <text x="190" y="170" textAnchor="middle" className="text-xs font-bold fill-red-700">FAIL</text>
                      </g>
                      
                      {/* 화살표 */}
                      <path d="M 105 145 L 85 155 M 80 150 L 85 155 L 80 160" stroke="#16a34a" strokeWidth="2" fill="none" />
                      <path d="M 145 145 L 165 155 M 160 150 L 165 155 L 160 160" stroke="#dc2626" strokeWidth="2" fill="none" />
                      
                      <text x="60" y="195" textAnchor="middle" className="text-xs">다음 공정</text>
                      <text x="190" y="195" textAnchor="middle" className="text-xs">재작업</text>
                    </svg>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>🎯 검사의 핵심 가치:</strong> 포토리소그라피는 전체 반도체 공정에서 가장 많은 비용이 소요되는 공정 중 하나이므로, 
                    정확한 검사를 통해 불량품의 후속 공정 진행을 방지하여 전체적인 수율과 비용 효율성을 크게 향상시킵니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
              <h4 className="text-lg font-semibold text-indigo-800 mb-4">🎓 공정 이해도 점검</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-3">온도별 공정 정리</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span className="font-medium">Dehydration:</span>
                      <span className="text-red-600">150-200°C</span>
                    </div>
                    <div className="flex justify-between p-2 bg-orange-50 rounded">
                      <span className="font-medium">HMDS:</span>
                      <span className="text-orange-600">~100°C</span>
                    </div>
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span className="font-medium">Soft Bake:</span>
                      <span className="text-yellow-600">~100°C</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span className="font-medium">PEB:</span>
                      <span className="text-green-600">Tg 고려</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="font-medium">Hard Bake:</span>
                      <span className="text-blue-600">120-140°C</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <h5 className="font-semibold text-indigo-800 mb-3">핵심 용어 정리</h5>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-purple-50 rounded">
                      <span className="font-medium text-purple-800">PAC:</span>
                      <span className="text-gray-700"> 빛 활성제</span>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <span className="font-medium text-blue-800">정재파:</span>
                      <span className="text-gray-700"> 빛 간섭으로 생긴 결</span>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <span className="font-medium text-green-800">TMAH:</span>
                      <span className="text-gray-700"> 알칼리 현상액</span>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <span className="font-medium text-yellow-800">EBR/WEE:</span>
                      <span className="text-gray-700"> 가장자리 제거</span>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <span className="font-medium text-red-800">Tg:</span>
                      <span className="text-gray-700"> 유리전이온도</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview2':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4">📷 포토리소그라피란?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                포토리소그라피(Photolithography)는 <strong>마스크의 회로 패턴을 실리콘 웨이퍼로 전사시키는 핵심 공정</strong>입니다. 
                빛을 이용하여 포토레지스트(PR)에 패턴을 형성하고, 이를 통해 반도체 소자의 정밀한 구조를 만들어갑니다.
              </p>
              <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                💡 <strong>핵심 원리:</strong> 광원 → 마스크 → 포토레지스트 → 현상 → 패턴 형성
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">포토리소그라피 공정 시각화</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnimationStep(Math.max(0, animationStep - 1))}
                    disabled={animationStep === 0}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    ◀ 이전
                  </button>
                  <button
                    onClick={() => setAnimationStep(Math.min(4, animationStep + 1))}
                    disabled={animationStep === 4}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    다음 ▶
                  </button>
                  <button
                    onClick={() => setAnimationStep(0)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    🔄 초기화
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 mb-4">
                {[0, 1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => setAnimationStep(step)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      animationStep === step
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {step + 1}단계
                  </button>
                ))}
              </div>
              
              <div className="flex justify-center">
                <svg width="600" height="500" viewBox="0 0 600 500">
                  {animationStep >= 0 && (
                    <g>
                      <text x="120" y="30" className="text-lg font-bold fill-gray-700">UV Light</text>
                      
                      <path d="M 80 50 L 80 110 M 75 105 L 80 110 L 85 105" stroke="#ff69b4" strokeWidth="3" fill="none" />
                      <path d="M 100 50 L 100 110 M 95 105 L 100 110 L 105 105" stroke="#ff69b4" strokeWidth="3" fill="none" />
                      <path d="M 120 50 L 120 110 M 115 105 L 120 110 L 125 105" stroke="#ff69b4" strokeWidth="3" fill="none" />
                      <path d="M 140 50 L 140 110 M 135 105 L 140 110 L 145 105" stroke="#ff69b4" strokeWidth="3" fill="none" />
                      <path d="M 160 50 L 160 110 M 155 105 L 160 110 L 165 105" stroke="#ff69b4" strokeWidth="3" fill="none" />
                    </g>
                  )}

                  {animationStep >= 1 && (
                    <g>
                      <text x="80" y="140" className="text-sm font-bold">Photomask</text>
                      
                      <rect x="50" y="150" width="140" height="25" fill="#f0f0f0" stroke="#666" strokeWidth="2" />
                      
                      <rect x="60" y="150" width="25" height="25" fill="#666" />
                      <rect x="105" y="150" width="25" height="25" fill="#666" />
                      <rect x="150" y="150" width="25" height="25" fill="#666" />
                      
                      <text x="95" y="168" className="text-xs fill-black">Glass</text>
                      <text x="67" y="195" className="text-xs fill-gray-600">Chrome</text>
                      <text x="157" y="195" className="text-xs fill-gray-600">Chrome</text>
                    </g>
                  )}

                  {animationStep >= 2 && (
                    <g>
                      <rect x="50" y="280" width="140" height="40" fill="#FFD700" />
                      <text x="120" y="303" textAnchor="middle" className="text-sm font-bold">Silicon Wafer</text>
                      
                      <rect x="50" y="260" width="140" height="20" fill="#90EE90" />
                      <text x="120" y="273" textAnchor="middle" className="text-sm font-bold fill-white">Oxide</text>
                      
                      <rect x="50" y="240" width="140" height="20" fill="#FF6B6B" />
                      <text x="120" y="253" textAnchor="middle" className="text-sm font-bold fill-white">Resist</text>
                      
                      <text x="120" y="340" textAnchor="middle" className="text-sm font-bold">Wafer Exposure</text>
                    </g>
                  )}

                  {animationStep >= 3 && (
                    <g>
                      <path d="M 95 175 L 95 235 M 90 230 L 95 235 L 100 230" stroke="#ff69b4" strokeWidth="4" fill="none" />
                      <path d="M 157 175 L 157 235 M 152 230 L 157 235 L 162 230" stroke="#ff69b4" strokeWidth="4" fill="none" />
                      
                      <rect x="85" y="240" width="20" height="20" fill="#FF9999" fillOpacity="0.8" />
                      <rect x="147" y="240" width="20" height="20" fill="#FF9999" fillOpacity="0.8" />
                      <text x="95" y="232" textAnchor="middle" className="text-xs">Exposed</text>
                      <text x="157" y="232" textAnchor="middle" className="text-xs">Exposed</text>
                      <text x="95" y="225" textAnchor="middle" className="text-xs">Resist</text>
                      <text x="157" y="225" textAnchor="middle" className="text-xs">Resist</text>
                    </g>
                  )}

                  {animationStep >= 4 && (
                    <g>
                      <path d="M 220 250 L 320 250" stroke="#F39C12" strokeWidth="3" />
                      <text x="270" y="245" textAnchor="middle" className="text-lg font-bold fill-orange-600">develop</text>
                      
                      <g>
                        <text x="430" y="200" textAnchor="middle" className="text-lg font-bold fill-blue-600">With positive PR</text>
                        
                        <rect x="350" y="280" width="140" height="40" fill="#FFD700" />
                        <text x="420" y="303" textAnchor="middle" className="text-sm font-bold">Silicon Wafer</text>
                        
                        <rect x="350" y="260" width="140" height="20" fill="#90EE90" />
                        <text x="420" y="273" textAnchor="middle" className="text-sm font-bold fill-white">Oxide</text>
                        
                        <rect x="350" y="240" width="25" height="20" fill="#FF6B6B" />
                        <rect x="395" y="240" width="20" height="20" fill="#FF6B6B" />
                        <rect x="435" y="240" width="25" height="20" fill="#FF6B6B" />
                        <rect x="475" y="240" width="15" height="20" fill="#FF6B6B" />
                        
                        <text x="362" y="253" textAnchor="middle" className="text-xs font-bold fill-white">Resist</text>
                        <text x="447" y="253" textAnchor="middle" className="text-xs font-bold fill-white">Resist</text>
                        
                        <text x="420" y="350" textAnchor="middle" className="text-sm font-bold fill-purple-600">패턴 형성 완료!</text>
                      </g>
                    </g>
                  )}
                </svg>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800 mb-2">
                  {animationStep === 0 && '1단계: UV 광원 - I-line(365nm) 자외선 조사'}
                  {animationStep === 1 && '2단계: 포토마스크 - 크롬 패턴으로 회로 설계'}
                  {animationStep === 2 && '3단계: PR 도포 웨이퍼 - 감광성 수지층 준비 완료'}
                  {animationStep === 3 && '4단계: 선택적 노광 - 마스크 패턴에 따른 화학 변화'}
                  {animationStep === 4 && '5단계: 현상 - 노광부 제거로 회로 패턴 완성'}
                </div>
                <div className="text-xs text-gray-600">
                  {animationStep === 0 && '반도체 제조의 핵심 공정인 미세 패턴 형성이 시작됩니다'}
                  {animationStep === 1 && '설계된 회로를 크롬으로 패터닝한 정밀한 마스크입니다'}
                  {animationStep === 2 && '스핀 코팅으로 균일하게 도포된 포토레지스트가 준비되었습니다'}
                  {animationStep === 3 && 'UV 광이 마스크를 통과하여 PR의 분자 구조를 변화시킵니다'}
                  {animationStep === 4 && 'TMAH 현상액으로 노광된 부분을 선택적으로 제거합니다'}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">포토레지스트(PR) 종류</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  prType === 'positive' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`} onClick={() => setPrType('positive')}>
                  <h5 className="font-semibold text-green-800 mb-2">Positive PR (양성 감광액)</h5>
                  <p className="text-sm text-gray-700 mb-3">빛을 받은 부분이 현상되어 제거됩니다</p>
                  <div className="text-xs">
                    <div className="mb-2">✓ 해상도가 우수함</div>
                    <div className="mb-2">✓ 반도체 공정에서 주로 사용</div>
                    <div>✓ 정밀한 패턴 형성 가능</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  prType === 'negative' ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-red-300'
                }`} onClick={() => setPrType('negative')}>
                  <h5 className="font-semibold text-red-800 mb-2">Negative PR (음성 감광액)</h5>
                  <p className="text-sm text-gray-700 mb-3">빛을 받지 않은 부분이 현상되어 제거됩니다</p>
                  <div className="text-xs">
                    <div className="mb-2">✗ 핀홀 결함 발생</div>
                    <div className="mb-2">✗ 해상도가 떨어짐</div>
                    <div>✗ 반도체에서 사용 제한</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">포토마스크 종류와 기술 발전</h4>
              
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                <h5 className="font-semibold text-amber-800 mb-2">반도체 미세화와 마스크 기술의 진화</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  무어의 법칙에 따른 반도체 미세화 진행으로 <strong>0.18μm 이하 공정</strong>에서 Binary 마스크의 
                  물리적 한계가 드러났습니다. 광의 회절 현상과 근접 효과로 인해 정밀한 패턴 형성이 어려워지면서 
                  새로운 마스크 기술의 필요성이 대두되었습니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  maskType === 'binary' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`} onClick={() => setMaskType('binary')}>
                  <h5 className="font-semibold text-blue-800 mb-2">Binary Mask (1990년대)</h5>
                  <p className="text-sm text-gray-700 mb-3">크롬으로 패턴을 형성한 기본 마스크</p>
                  
                  <div className="flex justify-center mb-4">
                    <svg width="200" height="120" viewBox="0 0 200 120">
                      <rect x="20" y="20" width="160" height="20" fill="#f0f0f0" stroke="#666" />
                      <rect x="40" y="20" width="30" height="20" fill="#333" />
                      <rect x="90" y="20" width="40" height="20" fill="#333" />
                      <rect x="150" y="20" width="20" height="20" fill="#333" />
                      <text x="100" y="55" textAnchor="middle" className="text-xs">크롬 패턴</text>
                      
                      <g stroke="#ff6b6b" strokeWidth="1" strokeDasharray="2,2">
                        <path d="M 70 40 Q 80 50 70 60" fill="none" />
                        <path d="M 130 40 Q 140 50 130 60" fill="none" />
                      </g>
                      <text x="100" y="75" textAnchor="middle" className="text-xs fill-red-600">회절 효과</text>
                    </svg>
                  </div>
                  
                  <div className="text-xs space-y-2">
                    <div className="text-green-600">✓ 단순하고 제작 용이</div>
                    <div className="text-green-600">✓ 0.25μm 이상 공정에 적합</div>
                    <div className="text-red-600">✗ 광 회절로 인한 패턴 왜곡</div>
                    <div className="text-red-600">✗ 0.18μm 이하에서 한계</div>
                    <div className="text-red-600">✗ 인접 패턴 간섭 현상</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  maskType === 'psm' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`} onClick={() => setMaskType('psm')}>
                  <h5 className="font-semibold text-purple-800 mb-2">PSM (2000년대~)</h5>
                  <p className="text-sm text-gray-700 mb-3">위상을 이용해 간섭을 제어하는 고급 마스크</p>
                  
                  <div className="flex justify-center mb-4">
                    <svg width="200" height="120" viewBox="0 0 200 120">
                      <rect x="20" y="20" width="160" height="20" fill="#f0f0f0" stroke="#666" />
                      <rect x="40" y="20" width="30" height="20" fill="#333" />
                      <rect x="70" y="15" width="20" height="30" fill="#8b5cf6" fillOpacity="0.6" />
                      <rect x="110" y="20" width="40" height="20" fill="#333" />
                      <rect x="130" y="15" width="20" height="30" fill="#8b5cf6" fillOpacity="0.6" />
                      <text x="100" y="55" textAnchor="middle" className="text-xs">위상 변화 영역</text>
                      
                      <g stroke="#10b981" strokeWidth="2">
                        <path d="M 80 60 L 90 70 L 100 60 L 110 70 L 120 60" fill="none" />
                      </g>
                      <text x="100" y="85" textAnchor="middle" className="text-xs fill-green-600">상쇄 간섭</text>
                    </svg>
                  </div>
                  
                  <div className="text-xs space-y-2">
                    <div className="text-green-600">✓ 0.13μm 이하 미세 패턴</div>
                    <div className="text-green-600">✓ 광 간섭 효과 적극 활용</div>
                    <div className="text-green-600">✓ 패턴 경계 선명도 향상</div>
                    <div className="text-red-600">✗ 복잡한 설계와 제작</div>
                    <div className="text-red-600">✗ 높은 제조 비용</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h6 className="font-semibold text-gray-800 mb-3">기술 전환의 핵심 동력</h6>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-white rounded border-l-4 border-red-400">
                      <div className="font-medium text-red-800">물리적 한계</div>
                      <p className="text-gray-700 mt-1">
                        광 파장 (365nm)보다 작은 패턴에서 회절 현상이 심화되어 
                        정확한 패턴 전사가 불가능해짐
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded border-l-4 border-blue-400">
                      <div className="font-medium text-blue-800">시장 요구</div>
                      <p className="text-gray-700 mt-1">
                        CPU 성능 향상, 메모리 집적도 증가 등을 위한 
                        지속적인 미세화 압박
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded border-l-4 border-green-400">
                      <div className="font-medium text-green-800">해결책</div>
                      <p className="text-gray-700 mt-1">
                        위상차를 이용한 상쇄간섭으로 회절 문제를 오히려 
                        해결책으로 활용하는 혁신적 접근
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h6 className="font-semibold text-purple-800 mb-2">PSM의 작동 원리</h6>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>1. 위상 변화:</strong> 투명 영역의 두께를 조절하여 통과하는 빛의 위상을 180° 변화시킴
                    </p>
                    <p>
                      <strong>2. 상쇄 간섭:</strong> 인접한 위상 반전 영역에서 나온 빛이 만나 상쇄되어 강한 암부 형성
                    </p>
                    <p>
                      <strong>3. 해상도 향상:</strong> 기존 Binary 마스크 대비 2배 이상의 해상도 개선 달성
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h6 className="font-semibold text-yellow-800 mb-2">현재와 미래</h6>
                  <div className="text-sm text-gray-700">
                    <p className="mb-2">
                      <strong>EUV 리소그라피 시대:</strong> 13.5nm 극자외선과 함께 PSM 기술은 계속 진화하고 있으며, 
                      7nm, 5nm 공정에서도 핵심 기술로 활용되고 있습니다.
                    </p>
                    <p>
                      <strong>다중 패터닝:</strong> 물리적 한계를 극복하기 위해 여러 번의 노광으로 하나의 층을 형성하는 
                      기술과 함께 사용되고 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🤔 생각해보기</h4>
              
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-lg border-l-4 border-blue-400">
                  <h5 className="font-semibold text-blue-800 mb-3">세계 포토리소그라피 장비 생태계</h5>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="mb-3">
                      <strong>ASML(네덜란드)</strong>이 EUV 리소그라피 장비를 독점하고 있는 상황에서, 
                      전 세계 반도체 산업이 한 회사에 의존하고 있습니다.
                    </p>
                    <div className="bg-blue-50 p-3 rounded border">
                      <p className="font-medium text-blue-900 mb-2">생각해볼 점들:</p>
                      <ul className="text-xs space-y-1 text-blue-800">
                        <li>• 한 회사의 기술 독점이 전 세계 반도체 산업에 미치는 영향은?</li>
                        <li>• 니콘, 캐논 등 일본 기업들이 EUV 경쟁에서 뒤처진 이유는?</li>
                        <li>• 지정학적 갈등 상황에서 장비 공급 중단이 미치는 파급효과는?</li>
                        <li>• 중국이 자체 EUV 장비 개발에 투자하는 이유는?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-l-4 border-green-400">
                  <h5 className="font-semibold text-green-800 mb-3">반도체 회사들의 복잡한 관계</h5>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="mb-3">
                      <strong>TSMC, 삼성, 인텔</strong> 등은 경쟁자이면서 동시에 서로 의존하는 관계입니다. 
                      애플, 엔비디아 같은 팹리스 회사들은 파운드리에 의존하고 있죠.
                    </p>
                    <div className="bg-green-50 p-3 rounded border">
                      <p className="font-medium text-green-900 mb-2">생각해볼 점들:</p>
                      <ul className="text-xs space-y-1 text-green-800">
                        <li>• 파운드리 vs 팹리스 모델의 장단점은 무엇일까?</li>
                        <li>• 애플이 TSMC에만 의존하는 것의 리스크는?</li>
                        <li>• 인텔이 파운드리 사업에 진출하는 이유는?</li>
                        <li>• 반도체 공급망이 특정 지역에 집중된 문제점은?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-l-4 border-red-400">
                  <h5 className="font-semibold text-red-800 mb-3">무어의 법칙과 물리적 한계</h5>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="mb-3">
                      현재 3nm 공정에서 <strong>양자 터널링 효과</strong>가 나타나고, 원자 몇 개 수준의 
                      구조를 다루면서 물리학의 근본적인 한계에 도달하고 있습니다.
                    </p>
                    <div className="bg-red-50 p-3 rounded border">
                      <p className="font-medium text-red-900 mb-2">생각해볼 점들:</p>
                      <ul className="text-xs space-y-1 text-red-800">
                        <li>• 2nm 이하에서는 어떤 물리적 현상들이 문제가 될까?</li>
                        <li>• 평면적 미세화의 한계를 3D 구조로 극복할 수 있을까?</li>
                        <li>• 실리콘을 대체할 새로운 소재들의 가능성은?</li>
                        <li>• 양자컴퓨팅, 광컴퓨팅 등 새로운 패러다임이 대안이 될까?</li>
                        <li>• 무어의 법칙이 끝나면 컴퓨터 산업은 어떻게 발전할까?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border-l-4 border-purple-400">
                  <h5 className="font-semibold text-purple-800 mb-3">미래 기술과 새로운 도전</h5>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="mb-3">
                      <strong>High-NA EUV, 원자층 증착(ALD), 분자빔 에피택시</strong> 등 새로운 기술들이 
                      등장하고 있지만, 비용과 복잡성은 기하급수적으로 증가하고 있습니다.
                    </p>
                    <div className="bg-purple-50 p-3 rounded border">
                      <p className="font-medium text-purple-900 mb-2">생각해볼 점들:</p>
                      <ul className="text-xs space-y-1 text-purple-800">
                        <li>• 반도체 제조 비용이 천문학적으로 증가하는 문제를 어떻게 해결할까?</li>
                        <li>• 새로운 리소그라피 기술(나노임프린트, 전자빔 등)의 가능성은?</li>
                        <li>• AI 칩 특화, 용도별 맞춤형 반도체 시대가 올까?</li>
                        <li>• 환경적 지속가능성을 고려한 반도체 제조는 가능할까?</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                  <p className="text-sm text-yellow-800 text-center font-medium">
                    💭 이러한 질문들을 통해 기술이 단순히 존재하는 것이 아니라, 
                    복잡한 경제적, 정치적, 물리적 제약 속에서 발전해나가는 것임을 이해해보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'process':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4">⚙️ 포토리소그라피 공정 실습</h3>
              <p className="text-gray-700">
                Recipe 단계별 파라미터를 조절하여 최적의 PR 코팅 결과를 얻어보세요.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold mb-4">PR 코팅 Recipe 설정</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 border rounded-lg bg-blue-50">
                      <h6 className="font-medium text-blue-800 mb-2">1단계: Spread</h6>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">RPM: {processParams.step1_rpm}</label>
                          <input
                            type="range"
                            min="300"
                            max="1000"
                            step="100"
                            value={processParams.step1_rpm}
                            onChange={(e) => setProcessParams({...processParams, step1_rpm: Number(e.target.value)})}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">시간: {processParams.step1_time}초</label>
                          <input
                            type="range"
                            min="2"
                            max="10"
                            step="1"
                            value={processParams.step1_time}
                            onChange={(e) => setProcessParams({...processParams, step1_time: Number(e.target.value)})}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">PR 고르게 분산</div>
                    </div>

                    <div className="p-3 border rounded-lg bg-green-50">
                      <h6 className="font-medium text-green-800 mb-2">2단계: Spin</h6>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">RPM: {processParams.step2_rpm}</label>
                          <input
                            type="range"
                            min="1000"
                            max="6000"
                            step="500"
                            value={processParams.step2_rpm}
                            onChange={(e) => setProcessParams({...processParams, step2_rpm: Number(e.target.value)})}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">시간: {processParams.step2_time}초</label>
                          <input
                            type="range"
                            min="10"
                            max="60"
                            step="5"
                            value={processParams.step2_time}
                            onChange={(e) => setProcessParams({...processParams, step2_time: Number(e.target.value)})}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">목표 두께 달성</div>
                    </div>

                    <div className="p-3 border rounded-lg bg-gray-50">
                      <h6 className="font-medium text-gray-800 mb-2">3단계: Stop</h6>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">RPM: {processParams.step3_rpm}</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="50"
                            value={processParams.step3_rpm}
                            onChange={(e) => setProcessParams({...processParams, step3_rpm: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">시간: {processParams.step3_time}초</label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={processParams.step3_time}
                            onChange={(e) => setProcessParams({...processParams, step3_time: Number(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">정지 및 안정화</div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h6 className="text-sm font-medium mb-2">Recipe 프로파일 미리보기</h6>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={generateRecipeProfile()} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" label={{ value: 'Time (sec)', position: 'insideBottom', offset: 0 }} />
                        <YAxis label={{ value: 'RPM', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value, name) => [value, name]} labelFormatter={(value) => `Time: ${value}s`} />
                        <Line type="monotone" dataKey="rpm" stroke="#3b82f6" strokeWidth="3" dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <button
                    onClick={runProcess}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mb-4"
                  >
                    {isProcessing ? '공정 진행중...' : 'Recipe 실행하기'}
                  </button>

                  {isProcessing && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${processProgress}%` }}
                      />
                    </div>
                  )}

                  <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <h5 className="font-medium text-amber-800 mb-2">기타 공정 파라미터</h5>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>• <strong>노광 조건</strong>: UV 파장(365nm), 노광량, 노광시간 등은 PR 종류와 목표 패턴에 따라 결정</p>
                      <p>• <strong>현상 조건</strong>: 현상액 종류(TMAH), 농도, 온도, 시간 등은 환경과 요구사항에 따라 최적화</p>
                      <p>• <strong>베이크 조건</strong>: Soft Bake, PEB, Hard Bake 온도와 시간은 PR 특성에 맞춰 설정</p>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-100 rounded border border-yellow-300">
                      <p className="text-sm text-yellow-800 font-medium">💡 실습 포인트</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        위 Recipe 파라미터들을 다양하게 조절해보세요! 특히 <strong>2단계 RPM을 1500과 4500으로 변경</strong>해서 
                        균일도 차이를 확인해보거나, <strong>1단계 시간을 2초와 8초로 비교</strong>해보면 PR 분산 효과의 중요성을 
                        직접 체험할 수 있습니다. 각 조건 변화가 최종 결과에 미치는 영향을 관찰해보세요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold mb-4">PR 코팅 결과 시각화</h4>
                
                {processResults.prThickness === 0 ? (
                  <div className="flex justify-center items-center h-96 text-gray-500">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-lg font-medium">Recipe를 실행하여</p>
                      <p className="text-sm">PR 코팅 결과를 확인해보세요</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <svg width="600" height="400" viewBox="0 0 600 400">
                      <rect x="50" y="280" width="500" height="80" fill="#4a5568" />
                      <text x="300" y="325" textAnchor="middle" fill="white" className="text-lg font-bold">Silicon Wafer</text>
                      
                      <g>
                        <rect x="50" y="260" width="500" height="20" fill="#3b82f6" />
                        
                        <ellipse cx="50" cy="270" rx="15" ry="15" fill="#3b82f6" />
                        <ellipse cx="550" cy="270" rx="15" ry="15" fill="#3b82f6" />
                        
                        {processParams.step2_rpm < 2000 && (
                          <>
                            <rect x="100" y="255" width="50" height="25" fill="#3b82f6" />
                            <rect x="200" y="258" width="50" height="22" fill="#3b82f6" />
                            <rect x="350" y="256" width="50" height="24" fill="#3b82f6" />
                            <rect x="450" y="257" width="50" height="23" fill="#3b82f6" />
                            <text x="300" y="240" textAnchor="middle" className="text-sm font-bold fill-red-600">
                              불균일한 두께 (저속 회전)
                            </text>
                          </>
                        )}
                        
                        {processParams.step2_rpm >= 2000 && processParams.step2_rpm <= 4000 && (
                          <>
                            <text x="300" y="240" textAnchor="middle" className="text-sm font-bold fill-green-600">
                              균일한 두께 (최적 RPM)
                            </text>
                          </>
                        )}
                        
                        {processParams.step2_rpm > 4000 && (
                          <>
                            <rect x="50" y="265" width="500" height="15" fill="#3b82f6" />
                            <text x="300" y="240" textAnchor="middle" className="text-sm font-bold fill-orange-600">
                              과도한 얇음 (고속 회전)
                            </text>
                          </>
                        )}
                        
                        <text x="50" y="200" className="text-xs fill-blue-800">Edge Bead</text>
                        <line x1="50" y1="210" x2="50" y2="255" stroke="#2563eb" strokeWidth="2" />
                        
                        <text x="350" y="200" className="text-xs fill-blue-800">Edge Bead</text>
                        <line x1="550" y1="210" x2="550" y2="255" stroke="#2563eb" strokeWidth="2" />
                      </g>
                      
                      <g>
                        <rect x="20" y="20" width="560" height="150" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" rx="8" />
                        <text x="30" y="40" className="text-sm font-bold fill-gray-800">실행된 Recipe 정보</text>
                        
                        <text x="30" y="65" className="text-xs fill-gray-700">
                          1단계 Spread: {processParams.step1_rpm} RPM × {processParams.step1_time}초
                        </text>
                        <text x="30" y="85" className="text-xs fill-gray-700">
                          2단계 Spin: {processParams.step2_rpm} RPM × {processParams.step2_time}초
                        </text>
                        <text x="30" y="105" className="text-xs fill-gray-700">
                          3단계 Stop: {processParams.step3_rpm} RPM × {processParams.step3_time}초
                        </text>
                        
                        <text x="320" y="65" className="text-xs fill-gray-700">
                          • PR 분산 효과: {processParams.step1_rpm >= 400 && processParams.step1_rpm <= 600 && processParams.step1_time >= 4 ? '우수' : '불량'}
                        </text>
                        <text x="320" y="85" className="text-xs fill-gray-700">
                          • 코팅 균일도: {processResults.uniformity.toFixed(1)}%
                        </text>
                        <text x="320" y="105" className="text-xs fill-gray-700">
                          • 결함 밀도: {processResults.defectDensity.toFixed(1)}/cm²
                        </text>
                        
                        <rect x="30" y="120" width="520" height="40" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" rx="4" />
                        <text x="40" y="140" className="text-sm font-bold fill-blue-800">PR 두께 측정 결과</text>
                        <text x="40" y="155" className="text-xs fill-blue-700">
                          측정 두께: {processResults.prThickness.toFixed(0)} nm (목표: 1000nm)
                        </text>
                        <text x="300" y="155" className="text-xs fill-blue-700">
                          두께 편차: {Math.abs(processResults.prThickness - 1000).toFixed(0)} nm
                        </text>
                      </g>
                      
                      <g>
                        <text x="300" y="380" textAnchor="middle" className="text-lg font-bold fill-purple-600">
                          균일도: {processResults.uniformity.toFixed(1)}%
                        </text>
                        
                        {processResults.uniformity >= 85 && (
                          <text x="300" y="395" textAnchor="middle" className="text-sm fill-green-600">✓ 우수한 코팅 품질</text>
                        )}
                        {processResults.uniformity >= 70 && processResults.uniformity < 85 && (
                          <text x="300" y="395" textAnchor="middle" className="text-sm fill-yellow-600">△ 보통 코팅 품질</text>
                        )}
                        {processResults.uniformity < 70 && (
                          <text x="300" y="395" textAnchor="middle" className="text-sm fill-red-600">✗ 불량한 코팅 품질</text>
                        )}
                      </g>
                    </svg>
                  </div>
                )}

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-2">PR 코팅 현상 설명</h5>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>• <strong>Edge Bead:</strong> 원심력으로 인해 웨이퍼 가장자리에 PR이 두껍게 쌓이는 현상</p>
                    <p>• <strong>RPM 영향:</strong> 너무 낮으면 불균일, 너무 높으면 과도하게 얇아짐</p>
                    <p>• <strong>1단계 중요성:</strong> 초기 분산이 전체 균일도에 큰 영향을 미침</p>
                    <p>• <strong>실제 공정:</strong> Edge Bead Removal(EBR) 공정으로 가장자리 제거 필요</p>
                  </div>
                </div>

                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold mb-4">환경 파라미터가 PR 코팅에 미치는 영향</h4>
                  <div className="text-sm text-gray-600 mb-4">
                    실제 제조 현장에서는 다양한 환경 조건이 PR 코팅 균일도에 영향을 미칩니다.
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-3 py-2 text-left font-medium">파라미터</th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-medium" colSpan="2">웨이퍼 영역별 영향</th>
                          <th className="border border-gray-300 px-3 py-2 text-center font-medium">코팅 형태</th>
                        </tr>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-3 py-2"></th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-sm">중심부</th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-sm">가장자리</th>
                          <th className="border border-gray-300 px-3 py-2 text-center text-sm">두께 프로파일</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">냉각 온도 ↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-red-600">↓</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">⌒ (가운데 오목)</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium">PR 온도 ↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-red-600">↓</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">∩ (가운데 볼록)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">배기량 ↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-500">-</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">⌒ (가장자리 상승)</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium">챔버 습도 ↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-red-600">↓</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-red-600">↓</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">▬ (전체 얇음)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-3 py-2 font-medium">챔버 온도 ↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">█ (전체 두꺼움)</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 font-medium">모터 온도 ↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-gray-500">-</td>
                          <td className="border border-gray-300 px-3 py-2 text-center text-blue-600">↑↑</td>
                          <td className="border border-gray-300 px-3 py-2 text-center">⌒⌒ (양쪽 끝 상승)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p><strong>핵심 포인트:</strong></p>
                    <p>• <span className="text-blue-600">↑</span> = 두께 증가, <span className="text-red-600">↓</span> = 두께 감소, <span className="text-gray-500">-</span> = 변화 없음</p>
                    <p>• 실제 제조에서는 이러한 모든 환경 변수를 종합적으로 제어해야 함</p>
                    <p>• RPM 외에도 온도, 습도, 배기 등이 PR 코팅 품질에 큰 영향을 미침</p>
                    <p>• 최적의 Recipe는 모든 환경 조건을 고려하여 설계됨</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exposure':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-orange-800 mb-4">💡 현대 리소그라피 기술 비교</h3>
              <p className="text-gray-700">
                리소그라피 시스템의 구성 요소와 각 기술의 특성을 체계적으로 비교해보세요.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">리소그라피 시스템 구성 요소와 분류</h4>
              
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <svg width="800" height="120" viewBox="0 0 800 120">
                    <rect x="20" y="40" width="80" height="40" fill="#ffd54f" stroke="#f57c00" strokeWidth="2" rx="5" />
                    <text x="60" y="65" textAnchor="middle" className="text-sm font-bold">광원</text>
                    <text x="60" y="95" textAnchor="middle" className="text-xs">Light Source</text>
                    
                    <path d="M 100 60 L 140 60 M 135 55 L 140 60 L 135 65" stroke="#666" strokeWidth="2" fill="none" />
                    
                    <rect x="150" y="40" width="80" height="40" fill="#81c784" stroke="#388e3c" strokeWidth="2" rx="5" />
                    <text x="190" y="65" textAnchor="middle" className="text-sm font-bold">광학계</text>
                    <text x="190" y="95" textAnchor="middle" className="text-xs">Optical System</text>
                    
                    <path d="M 230 60 L 270 60 M 265 55 L 270 60 L 265 65" stroke="#666" strokeWidth="2" fill="none" />
                    
                    <rect x="280" y="40" width="80" height="40" fill="#ffb74d" stroke="#f57c00" strokeWidth="2" rx="5" />
                    <text x="320" y="65" textAnchor="middle" className="text-sm font-bold">마스크</text>
                    <text x="320" y="95" textAnchor="middle" className="text-xs">Mask/Reticle</text>
                    
                    <path d="M 360 60 L 400 60 M 395 55 L 400 60 L 395 65" stroke="#666" strokeWidth="2" fill="none" />
                    
                    <rect x="410" y="40" width="80" height="40" fill="#64b5f6" stroke="#1976d2" strokeWidth="2" rx="5" />
                    <text x="450" y="65" textAnchor="middle" className="text-sm font-bold">노광방식</text>
                    <text x="450" y="95" textAnchor="middle" className="text-xs">Exposure Method</text>
                    
                    <path d="M 490 60 L 530 60 M 525 55 L 530 60 L 525 65" stroke="#666" strokeWidth="2" fill="none" />
                    
                    <rect x="540" y="40" width="80" height="40" fill="#ce93d8" stroke="#8e24aa" strokeWidth="2" rx="5" />
                    <text x="580" y="65" textAnchor="middle" className="text-sm font-bold">웨이퍼</text>
                    <text x="580" y="95" textAnchor="middle" className="text-xs">Wafer</text>
                  </svg>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h6 className="font-semibold text-yellow-800 mb-2">1. 광원</h6>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li>• DUV: 193nm (ArF)</li>
                      <li>• EUV: 13.5nm</li>
                      <li>• 파장이 해상도 결정</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h6 className="font-semibold text-green-800 mb-2">2. 광학계</h6>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li>• DUV: 굴절 렌즈</li>
                      <li>• EUV: 반사 미러</li>
                      <li>• 빛을 집속/제어</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <h6 className="font-semibold text-orange-800 mb-2">3. 마스크</h6>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li>• Binary/PSM</li>
                      <li>• EUV 반사형</li>
                      <li>• 패턴 정보 저장</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h6 className="font-semibold text-blue-800 mb-2">4. 노광방식</h6>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li>• Stepper: 정지</li>
                      <li>• Scanner: 스캔</li>
                      <li>• 패턴 전사 방법</li>
                    </ul>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h6 className="font-semibold text-purple-800 mb-2">5. 웨이퍼</h6>
                    <ul className="text-xs space-y-1 text-gray-700">
                      <li>• PR 코팅된 기판</li>
                      <li>• 최종 패턴 형성</li>
                      <li>• 반도체 소자 제작</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h6 className="font-semibold text-blue-800 mb-2">기술 조합의 이해</h6>
                <div className="text-sm text-gray-700 space-y-2">
                  <p><strong>광원 + 광학계:</strong> DUV는 렌즈 시스템, EUV는 미러 시스템을 사용합니다.</p>
                  <p><strong>노광방식:</strong> 광원/광학계와 독립적으로 Stepper 또는 Scanner 방식을 선택할 수 있습니다.</p>
                  <p><strong>실제 조합:</strong> "ArF Scanner", "EUV Scanner" 등으로 조합하여 명명합니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg shadow-md border border-amber-200">
              <h4 className="text-lg font-semibold text-amber-800 mb-4">🤔 헷갈리기 쉬운 개념 정리</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-800 mb-3">🚗 자동차로 비유하면</h5>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <div className="font-medium text-blue-800">엔진 종류 (광원+광학계)</div>
                      <div className="text-blue-700 mt-1">
                        • 가솔린 엔진 ↔ DUV (ArF + 렌즈)<br/>
                        • 전기 모터 ↔ EUV (13.5nm + 미러)
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                      <div className="font-medium text-green-800">변속기 종류 (노광방식)</div>
                      <div className="text-green-700 mt-1">
                        • 수동변속기 ↔ Stepper<br/>
                        • 자동변속기 ↔ Scanner
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded border">
                    <div className="text-xs text-gray-700">
                      <strong>조합 예시:</strong><br/>
                      "가솔린+수동" = "DUV Stepper"<br/>
                      "가솔린+자동" = "DUV Scanner"<br/>
                      "전기+자동" = "EUV Scanner"
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-800 mb-3">⚡ 실제 기술 분류</h5>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-cyan-50 rounded border-l-4 border-cyan-400">
                      <div className="font-medium text-cyan-800">광원 + 광학계</div>
                      <div className="text-cyan-700 mt-1">
                        빛을 만들고 조절하는 방법<br/>
                        • DUV: 193nm + 굴절 렌즈<br/>
                        • EUV: 13.5nm + 반사 미러
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                      <div className="font-medium text-purple-800">노광 방식</div>
                      <div className="text-purple-700 mt-1">
                        웨이퍼에 패턴을 전사하는 방법<br/>
                        • Stepper: 정지해서 일괄 노광<br/>
                        • Scanner: 스캔하며 순차 노광
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-300">
                    <div className="text-xs text-yellow-800">
                      <strong>핵심:</strong> 이 두 기술은 독립적으로 선택하여 조합할 수 있습니다!
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h6 className="font-semibold text-orange-800 mb-2">💡 왜 이렇게 분류하나요?</h6>
                <div className="text-sm text-orange-700 space-y-2">
                  <p><strong>광원+광학계:</strong> 해상도와 공정 노드를 결정하는 핵심 기술</p>
                  <p><strong>노광방식:</strong> 생산성과 필드 크기를 결정하는 제조 방식</p>
                  <p><strong>조합의 이유:</strong> 목적에 따라 최적의 조합을 선택할 수 있어 유연성 확보</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-8">광원 + 광학계 시스템 비교</h4>
              
              <div className="space-y-12">
                <div className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                  exposureType === 'duv' ? 'border-cyan-400 bg-cyan-50' : 'border-gray-200 hover:border-cyan-300'
                }`} onClick={() => setExposureType('duv')}>
                  <h5 className="font-semibold text-cyan-800 mb-6">DUV 시스템 (ArF 193nm)</h5>
                  <div className="flex items-start gap-12">
                    <div className="flex-1 min-w-0">
                      <svg width="100%" height="500" viewBox="0 0 300 500" className="max-w-sm mx-auto">
                        <circle cx="150" cy="40" r="20" fill="#00d4aa" stroke="#00897b" strokeWidth="2" />
                        <text x="150" y="47" textAnchor="middle" className="text-sm font-bold fill-white">ArF</text>
                        <text x="150" y="85" textAnchor="middle" className="text-sm font-bold">ArF Laser</text>
                        <text x="150" y="100" textAnchor="middle" className="text-xs">193nm</text>
                        
                        <line x1="150" y1="60" x2="150" y2="130" stroke="#00d4aa" strokeWidth="4" strokeDasharray="8,4" />
                        
                        <g transform="translate(150, 150)">
                          <ellipse cx="0" cy="0" rx="55" ry="12" fill="#4dd0e1" fillOpacity="0.8" stroke="#00acc1" strokeWidth="3" />
                          <ellipse cx="0" cy="30" rx="48" ry="10" fill="#4dd0e1" fillOpacity="0.8" stroke="#00acc1" strokeWidth="3" />
                          <ellipse cx="0" cy="60" rx="40" ry="8" fill="#4dd0e1" fillOpacity="0.8" stroke="#00acc1" strokeWidth="3" />
                          <ellipse cx="0" cy="90" rx="48" ry="10" fill="#4dd0e1" fillOpacity="0.8" stroke="#00acc1" strokeWidth="3" />
                          <ellipse cx="0" cy="120" rx="55" ry="12" fill="#4dd0e1" fillOpacity="0.8" stroke="#00acc1" strokeWidth="3" />
                        </g>
                        <text x="150" y="295" textAnchor="middle" className="text-sm font-bold">굴절 렌즈 시스템</text>
                        <text x="150" y="310" textAnchor="middle" className="text-xs">(Transmissive)</text>
                        
                        <g stroke="#00d4aa" strokeWidth="2" fill="none">
                          <path d="M 145 162 L 145 172 M 140 167 L 145 172 L 150 167" />
                          <path d="M 155 162 L 155 172 M 150 167 L 155 172 L 160 167" />
                          <path d="M 145 192 L 145 202 M 140 197 L 145 202 L 150 197" />
                          <path d="M 155 192 L 155 202 M 150 197 L 155 202 L 160 197" />
                          <path d="M 145 222 L 145 232 M 140 227 L 145 232 L 150 227" />
                          <path d="M 155 222 L 155 232 M 150 227 L 155 232 L 160 227" />
                          <path d="M 145 252 L 145 262 M 140 257 L 145 262 L 150 257" />
                          <path d="M 155 252 L 155 262 M 150 257 L 155 262 L 160 257" />
                        </g>
                        
                        <rect x="100" y="340" width="100" height="12" fill="#f0f0f0" stroke="#666" strokeWidth="2" />
                        <rect x="110" y="340" width="15" height="12" fill="#333" />
                        <rect x="135" y="340" width="15" height="12" fill="#333" />
                        <rect x="155" y="340" width="15" height="12" fill="#333" />
                        <rect x="175" y="340" width="15" height="12" fill="#333" />
                        <text x="150" y="375" textAnchor="middle" className="text-sm font-bold">Reticle</text>
                        
                        <rect x="100" y="420" width="100" height="15" fill="#3b82f6" stroke="#1976d2" strokeWidth="2" />
                        <text x="150" y="460" textAnchor="middle" className="text-sm font-bold">Wafer</text>
                      </svg>
                    </div>
                    
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="bg-white p-5 rounded-lg border border-cyan-200">
                        <h6 className="font-semibold text-cyan-800 mb-4">주요 특징</h6>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>성숙한 기술, 안정적 운영</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>상대적 저비용</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>28nm~7nm 공정 적용</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>다중패터닝 필요</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>복잡한 공정</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-cyan-50 p-5 rounded-lg border border-cyan-200">
                        <h6 className="font-semibold text-cyan-800 mb-3">기술 스펙</h6>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">파장:</span> 193nm (ArF 엑시머 레이저)</p>
                          <p><span className="font-medium">광학계:</span> 굴절형 렌즈</p>
                          <p><span className="font-medium">NA:</span> ~1.35 (물 침지 포함)</p>
                          <p><span className="font-medium">해상도:</span> ~40nm (단일패터닝)</p>
                          <p><span className="font-medium">처리량:</span> 높음 (300+ wph)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                  exposureType === 'euv' ? 'border-purple-400 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                }`} onClick={() => setExposureType('euv')}>
                  <h5 className="font-semibold text-purple-800 mb-6">EUV 시스템 (13.5nm)</h5>
                  <div className="flex items-start gap-12">
                    <div className="flex-1 min-w-0">
                      <svg width="100%" height="500" viewBox="0 0 300 500" className="max-w-sm mx-auto">
                        <circle cx="150" cy="40" r="20" fill="#9c88ff" stroke="#7e57c2" strokeWidth="2" />
                        <text x="150" y="47" textAnchor="middle" className="text-sm font-bold fill-white">EUV</text>
                        <text x="150" y="85" textAnchor="middle" className="text-sm font-bold">EUV Source</text>
                        <text x="150" y="100" textAnchor="middle" className="text-xs">13.5nm</text>
                        
                        <line x1="150" y1="60" x2="200" y2="130" stroke="#9c88ff" strokeWidth="4" strokeDasharray="6,4" />
                        
                        <g>
                          <ellipse cx="210" cy="150" rx="35" ry="8" fill="#d1c4e9" stroke="#7e57c2" strokeWidth="3" />
                          <ellipse cx="170" cy="190" rx="30" ry="7" fill="#d1c4e9" stroke="#7e57c2" strokeWidth="3" />
                          <ellipse cx="120" cy="230" rx="35" ry="8" fill="#d1c4e9" stroke="#7e57c2" strokeWidth="3" />
                          <ellipse cx="170" cy="270" rx="30" ry="7" fill="#d1c4e9" stroke="#7e57c2" strokeWidth="3" />
                        </g>
                        <text x="170" y="310" textAnchor="middle" className="text-sm font-bold">반사 미러 시스템</text>
                        <text x="170" y="325" textAnchor="middle" className="text-xs">(Reflective)</text>
                        
                        <path d="M 195 145 L 175 185 L 125 225 L 165 265 L 150 350" 
                              stroke="#9c88ff" strokeWidth="3" fill="none" strokeDasharray="6,4" />
                        
                        <g stroke="#9c88ff" strokeWidth="2" fill="#9c88ff">
                          <path d="M 190 150 L 185 155 L 195 158 Z" />
                          <path d="M 170 190 L 165 195 L 175 198 Z" />
                          <path d="M 130 235 L 125 240 L 135 243 Z" />
                          <path d="M 170 275 L 165 280 L 175 283 Z" />
                        </g>
                        
                        <rect x="100" y="360" width="100" height="12" fill="#e3f2fd" stroke="#1976d2" strokeWidth="2" />
                        <rect x="110" y="360" width="15" height="12" fill="#424242" />
                        <rect x="135" y="360" width="15" height="12" fill="#424242" />
                        <rect x="155" y="360" width="15" height="12" fill="#424242" />
                        <rect x="175" y="360" width="15" height="12" fill="#424242" />
                        <text x="150" y="395" textAnchor="middle" className="text-sm font-bold">EUV Mask (반사형)</text>
                        
                        <rect x="100" y="430" width="100" height="15" fill="#3b82f6" stroke="#1976d2" strokeWidth="2" />
                        <text x="150" y="470" textAnchor="middle" className="text-sm font-bold">Wafer</text>
                      </svg>
                    </div>
                    
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="bg-white p-5 rounded-lg border border-purple-200">
                        <h6 className="font-semibold text-purple-800 mb-4">주요 특징</h6>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>단일패터닝 가능</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>7nm 이하 최첨단 공정</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>단순화된 공정</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>매우 높은 비용</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>낮은 처리량 (throughput)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                        <h6 className="font-semibold text-purple-800 mb-3">기술 스펙</h6>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">파장:</span> 13.5nm (플라즈마 광원)</p>
                          <p><span className="font-medium">광학계:</span> 반사형 미러</p>
                          <p><span className="font-medium">NA:</span> 0.33 (High-NA: 0.55)</p>
                          <p><span className="font-medium">해상도:</span> ~13nm (단일패터닝)</p>
                          <p><span className="font-medium">처리량:</span> 낮음 (150+ wph)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-8">노광방식 비교 (광원과 독립적)</h4>
              
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>중요:</strong> Stepper와 Scanner는 DUV, EUV 모든 광원 시스템에서 사용할 수 있는 노광 방식입니다.
                  예: "DUV Scanner", "EUV Scanner", "ArF Stepper" 등
                </p>
              </div>
              
              <div className="space-y-12">
                <div className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                  exposureType === 'stepper' ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`} onClick={() => setExposureType('stepper')}>
                  <h5 className="font-semibold text-blue-800 mb-6">Stepper (Step & Repeat)</h5>
                  <div className="flex items-start gap-12">
                    <div className="flex-1 min-w-0">
                      <svg width="100%" height="500" viewBox="0 0 400 500" className="max-w-sm mx-auto">
                        {/* Background */}
                        <rect x="0" y="0" width="400" height="500" fill="#0f1629" rx="10" />
                        
                        {/* Laser */}
                        <g transform="translate(200, 100)">
                          <circle cx="0" cy="0" r="16" fill="#fbbf24" />
                          <path d="M -8 -8 L 8 -8 L 8 8 L -8 8 Z M -4 -4 L 4 -4 L 4 4 L -4 4 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                          <path d="M -12 -12 L -8 -8 M 12 -12 L 8 -8 M -12 12 L -8 8 M 12 12 L 8 8" stroke="#fbbf24" strokeWidth="2" />
                        </g>
                        <text x="280" y="110" className="text-sm font-medium fill-white">Laser</text>
                        
                        {/* Light arrows to lens */}
                        <path d="M 185 115 L 130 140 M 125 135 L 130 140 L 125 145" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 215 115 L 270 140 M 265 135 L 270 140 L 265 145" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Lens (illuminator) */}
                        <ellipse cx="200" cy="150" rx="80" ry="12" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <text x="300" y="155" className="text-sm font-medium fill-white">Lens</text>
                        <text x="300" y="170" className="text-xs fill-white">(illuminator)</text>
                        
                        {/* Light arrows to mask */}
                        <path d="M 170 162 L 170 190 M 165 185 L 170 190 L 175 185" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 230 162 L 230 190 M 225 185 L 230 190 L 235 185" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Mask (reticle) */}
                        <rect x="120" y="200" width="160" height="12" fill="#a855f7" stroke="#9333ea" strokeWidth="2" />
                        <rect x="140" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="160" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="180" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="200" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="220" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="240" y="200" width="12" height="12" fill="#fbbf24" />
                        <text x="300" y="210" className="text-sm font-medium fill-white">Mask</text>
                        <text x="300" y="225" className="text-xs fill-white">(reticle)</text>
                        
                        {/* Light arrows to projection lens */}
                        <path d="M 170 212 L 170 240 M 165 235 L 170 240 L 175 235" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 230 212 L 230 240 M 225 235 L 230 240 L 235 235" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Projection lens system */}
                        <rect x="290" y="250" width="15" height="80" fill="white" />
                        <text x="315" y="275" className="text-sm font-medium fill-white">Projection</text>
                        <text x="315" y="290" className="text-sm font-medium fill-white">lens</text>
                        
                        <ellipse cx="200" cy="250" rx="60" ry="10" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="270" rx="45" ry="8" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="290" rx="35" ry="6" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="310" rx="45" ry="8" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="330" rx="60" ry="10" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        
                        {/* Light convergence */}
                        <path d="M 160 340 L 180 360 M 175 355 L 180 360 L 175 365" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 240 340 L 220 360 M 225 355 L 220 360 L 225 365" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Wafer */}
                        <rect x="130" y="380" width="140" height="15" fill="#22c55e" />
                        <rect x="130" y="395" width="140" height="15" fill="#3b82f6" />
                        <rect x="130" y="410" width="140" height="15" fill="#1e40af" />
                        <text x="280" y="405" className="text-sm font-medium fill-white">Wafer</text>
                        
                        <text x="200" y="450" textAnchor="middle" className="text-sm font-bold fill-white">전체 필드 한번에 노광</text>
                        <text x="200" y="470" textAnchor="middle" className="text-xs fill-gray-300">웨이퍼와 레티클 모두 고정</text>
                      </svg>
                    </div>
                    
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="bg-white p-5 rounded-lg border border-blue-200">
                        <h6 className="font-semibold text-blue-800 mb-4">주요 특징</h6>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>높은 해상도</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>작은 칩에 적합</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-600 font-bold">△</span>
                            <span>렌즈 가장자리 수차</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>필드 크기 제한</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-600 font-bold">✗</span>
                            <span>낮은 처리량</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                        <h6 className="font-semibold text-blue-800 mb-3">동작 원리</h6>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">방식:</span> 일괄 노광 (Batch)</p>
                          <p><span className="font-medium">필드 크기:</span> 제한적 (~22×26mm)</p>
                          <p><span className="font-medium">이동:</span> Step만 수행</p>
                          <p><span className="font-medium">노광 시간:</span> 짧음</p>
                          <p><span className="font-medium">응용:</span> 소형 칩, 고해상도 필요</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <h6 className="font-semibold text-gray-800 mb-3">현재 활용도</h6>
                        <div className="text-sm text-gray-700">
                          <p>주로 특수 용도나 R&D에서 사용되며, 대량 생산에서는 Scanner가 주류를 이루고 있음</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-8 rounded-lg border-2 cursor-pointer transition-all ${
                  exposureType === 'scanner' ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`} onClick={() => setExposureType('scanner')}>
                  <h5 className="font-semibold text-green-800 mb-6">Scanner (Step & Scan)</h5>
                  <div className="flex items-start gap-12">
                    <div className="flex-1 min-w-0">
                      <svg width="100%" height="500" viewBox="0 0 400 500" className="max-w-sm mx-auto">
                        {/* Background */}
                        <rect x="0" y="0" width="400" height="500" fill="#0f1629" rx="10" />
                        
                        {/* Laser */}
                        <g transform="translate(200, 100)">
                          <circle cx="0" cy="0" r="16" fill="#fbbf24" />
                          <path d="M -8 -8 L 8 -8 L 8 8 L -8 8 Z M -4 -4 L 4 -4 L 4 4 L -4 4 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                          <path d="M -12 -12 L -8 -8 M 12 -12 L 8 -8 M -12 12 L -8 8 M 12 12 L 8 8" stroke="#fbbf24" strokeWidth="2" />
                        </g>
                        <text x="280" y="110" className="text-sm font-medium fill-white">Laser</text>
                        
                        {/* Angled light arrows to lens (scanning) */}
                        <path d="M 170 115 L 140 140 M 135 135 L 140 140 L 135 145" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 230 115 L 260 140 M 255 135 L 260 140 L 255 145" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <line x1="140" y1="130" x2="260" y2="130" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4,4" />
                        
                        {/* Lens (illuminator) */}
                        <ellipse cx="200" cy="150" rx="80" ry="12" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <text x="300" y="155" className="text-sm font-medium fill-white">Lens</text>
                        <text x="300" y="170" className="text-xs fill-white">(illuminator)</text>
                        
                        {/* Light arrows to mask */}
                        <path d="M 170 162 L 170 190 M 165 185 L 170 190 L 175 185" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 230 162 L 230 190 M 225 185 L 230 190 L 235 185" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Mask (reticle) with scan arrows */}
                        <rect x="120" y="200" width="160" height="12" fill="#a855f7" stroke="#9333ea" strokeWidth="2" />
                        <rect x="140" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="160" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="180" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="200" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="220" y="200" width="12" height="12" fill="#fbbf24" />
                        <rect x="240" y="200" width="12" height="12" fill="#fbbf24" />
                        <text x="300" y="210" className="text-sm font-medium fill-white">Mask</text>
                        <text x="300" y="225" className="text-xs fill-white">(reticle)</text>
                        
                        {/* Scan arrow for mask */}
                        <path d="M 290 190 L 320 190 M 315 185 L 320 190 L 315 195" stroke="#ef4444" strokeWidth="3" fill="none" />
                        
                        {/* Light arrows to projection lens */}
                        <path d="M 170 212 L 170 240 M 165 235 L 170 240 L 175 235" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 230 212 L 230 240 M 225 235 L 230 240 L 235 235" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Projection lens system */}
                        <rect x="290" y="250" width="15" height="80" fill="white" />
                        <text x="315" y="275" className="text-sm font-medium fill-white">Projection</text>
                        <text x="315" y="290" className="text-sm font-medium fill-white">lens</text>
                        
                        <ellipse cx="200" cy="250" rx="60" ry="10" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="270" rx="45" ry="8" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="290" rx="35" ry="6" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="310" rx="45" ry="8" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        <ellipse cx="200" cy="330" rx="60" ry="10" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                        
                        {/* Light convergence */}
                        <path d="M 160 340 L 180 360 M 175 355 L 180 360 L 175 365" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        <path d="M 240 340 L 220 360 M 225 355 L 220 360 L 225 365" stroke="#0ea5e9" strokeWidth="3" fill="none" />
                        
                        {/* Wafer with scan arrow */}
                        <rect x="130" y="380" width="140" height="15" fill="#22c55e" />
                        <rect x="130" y="395" width="140" height="15" fill="#3b82f6" />
                        <rect x="130" y="410" width="140" height="15" fill="#1e40af" />
                        <text x="280" y="405" className="text-sm font-medium fill-white">Wafer</text>
                        
                        {/* Scan arrow for wafer */}
                        <path d="M 280 390 L 320 390 M 315 385 L 320 390 L 315 395" stroke="#ef4444" strokeWidth="3" fill="none" />
                        
                        {/* Synchronization line */}
                        <line x1="320" y1="190" x2="320" y2="390" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,6" />
                        
                        <text x="200" y="450" textAnchor="middle" className="text-sm font-bold fill-white">스캔하며 순차 노광</text>
                        <text x="200" y="470" textAnchor="middle" className="text-xs fill-gray-300">레티클과 웨이퍼 동기화 스캔</text>
                      </svg>
                    </div>
                    
                    <div className="flex-1 space-y-4 min-w-0">
                      <div className="bg-white p-5 rounded-lg border border-green-200">
                        <h6 className="font-semibold text-green-800 mb-4">주요 특징</h6>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>큰 노광 필드</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>수차 최소화</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>높은 처리량</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>현재 주류 방식</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-600 font-bold">△</span>
                            <span>복잡한 동기화</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                        <h6 className="font-semibold text-green-800 mb-3">동작 원리</h6>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">방식:</span> 스캔 노광 (Scanning)</p>
                          <p><span className="font-medium">필드 크기:</span> 대형 (~26×33mm)</p>
                          <p><span className="font-medium">이동:</span> Step + Scan 수행</p>
                          <p><span className="font-medium">동기화:</span> 레티클-웨이퍼 정밀 동기</p>
                          <p><span className="font-medium">응용:</span> 대량 생산, 대형 칩</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                        <h6 className="font-semibold text-blue-800 mb-3">현재 활용도</h6>
                        <div className="text-sm text-blue-700">
                          <p>현재 반도체 대량 생산의 표준 방식이며, 대부분의 최신 리소그라피 장비에서 채택</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">차세대 리소그라피 기술</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-purple-800 mb-2">나노임프린트 (NIL)</h5>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p>• 물리적 압인 방식</p>
                    <p>• 마스크 없이 패턴 형성</p>
                    <p className="text-green-600">✓ 저비용, 고해상도</p>
                    <p className="text-red-600">✗ 처리량 낮음</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-blue-800 mb-2">전자빔 (E-beam)</h5>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p>• 전자빔 직접 묘화</p>
                    <p>• 마스크 제작용 주로 사용</p>
                    <p className="text-green-600">✓ 최고 해상도</p>
                    <p className="text-red-600">✗ 매우 느린 속도</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-800 mb-2">X-ray 리소그라피</h5>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p>• 연 X선 (1nm 파장)</p>
                    <p>• 싱크로트론 광원 필요</p>
                    <p className="text-green-600">✓ 극초단파장</p>
                    <p className="text-red-600">✗ 상용화 실패</p>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">DSA (자기조립)</h5>
                  <div className="text-xs space-y-1 text-gray-700">
                    <p>• 화학적 패턴 형성</p>
                    <p>• 블록공중합체 활용</p>
                    <p className="text-green-600">✓ 공정 단순화</p>
                    <p className="text-red-600">✗ 제어 어려움</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h6 className="font-semibold text-amber-800 mb-2">파장 진화의 역사</h6>
                <div className="text-sm text-gray-700">
                  <p className="mb-2">리소그라피 기술 발전의 핵심은 <strong>짧은 파장</strong>을 향한 지속적인 도전이었습니다:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2 bg-white rounded border">
                      <div className="font-medium text-blue-800">g-line/i-line</div>
                      <div className="text-gray-600">436nm/365nm</div>
                      <div className="text-gray-500">1990년대</div>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <div className="font-medium text-green-800">KrF/ArF</div>
                      <div className="text-gray-600">248nm/193nm</div>
                      <div className="text-gray-500">2000년대</div>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <div className="font-medium text-purple-800">EUV</div>
                      <div className="text-gray-600">13.5nm</div>
                      <div className="text-gray-500">현재</div>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <div className="font-medium text-red-800">X-ray</div>
                      <div className="text-gray-600">1nm</div>
                      <div className="text-gray-500">연구중단</div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-amber-700">
                    <strong>X-ray 리소그라피:</strong> 1990년대 IBM에서 연구했지만, 싱크로트론 설비의 복잡성과 
                    높은 비용으로 인해 상용화되지 못했습니다. EUV가 더 실용적인 대안으로 채택되었습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">현대 리소그라피 기술 성능 비교</h4>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={[
                  { method: 'DUV ArF', resolution: 85, throughput: 90, cost: 60, minNode: 28 },
                  { method: 'DUV Immersion', resolution: 90, throughput: 85, cost: 70, minNode: 14 },
                  { method: 'EUV', resolution: 98, throughput: 40, cost: 100, minNode: 5 },
                  { method: 'E-beam', resolution: 100, throughput: 5, cost: 30, minNode: 2 },
                  { method: 'NIL', resolution: 95, throughput: 20, cost: 25, minNode: 10 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value, name) => {
                    const nameMap = {
                      resolution: '해상도 (%)',
                      throughput: '처리량 (%)',
                      cost: '비용 지수',
                      minNode: '최소 공정 (nm)'
                    };
                    return [value, nameMap[name] || name];
                  }} />
                  <Bar dataKey="resolution" fill="#3b82f6" name="해상도" />
                  <Bar dataKey="throughput" fill="#10b981" name="처리량" />
                  <Bar dataKey="cost" fill="#ef4444" name="비용" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
              <h4 className="text-lg font-semibold text-indigo-800 mb-4">리소그라피 기술 발전 로드맵</h4>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-indigo-700">1990년대</div>
                  <div className="flex-1 p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="font-medium">i-line (365nm)</span> → 350nm 공정
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-indigo-700">2000년대</div>
                  <div className="flex-1 p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="font-medium">KrF (248nm)</span> → 250nm~130nm 공정
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-indigo-700">2010년대</div>
                  <div className="flex-1 p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="font-medium">ArF (193nm)</span> → 90nm~7nm 공정 (다중패터닝)
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-indigo-700">2020년대</div>
                  <div className="flex-1 p-3 bg-white rounded-lg border border-indigo-200">
                    <span className="font-medium">EUV (13.5nm)</span> → 7nm~3nm 공정
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-indigo-700">미래</div>
                  <div className="flex-1 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200">
                    <span className="font-medium">High-NA EUV, 차세대 기술</span> → 2nm 이하
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2">핵심 트렌드</h5>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>• <strong>파장 단축:</strong> 더 미세한 패턴을 위한 지속적인 파장 감소</p>
                  <p>• <strong>NA 증가:</strong> High-NA EUV (0.55)로 해상도 향상</p>
                  <p>• <strong>다중 패터닝:</strong> 물리 한계 극복을 위한 복잡한 공정</p>
                  <p>• <strong>하이브리드 접근:</strong> 여러 기술의 조합으로 최적화</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg shadow-md border border-amber-200">
              <h4 className="text-lg font-semibold text-amber-800 mb-4">🤔 실무진의 고민거리</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-800 mb-3">반도체 회사의 기술 선택 딜레마</h5>
                  <div className="text-sm text-gray-700 space-y-3">
                    <p className="mb-3">
                      새로운 팹(fab)을 건설할 때, <strong>어떤 리소그라피 기술을 선택할 것인가?</strong>
                    </p>
                    <div className="bg-amber-50 p-3 rounded border border-amber-200">
                      <p className="font-medium text-amber-900 mb-2">현실적 고려사항:</p>
                      <ul className="text-xs space-y-1 text-amber-800">
                        <li>• <strong>DUV:</strong> 검증된 기술, 안정적 수율, 상대적 저비용</li>
                        <li>• <strong>EUV:</strong> 미래 경쟁력, 단일패터닝, 하지만 높은 리스크</li>
                        <li>• <strong>투자 회수 기간:</strong> 10년 이상 사용할 장비</li>
                        <li>• <strong>고객 요구:</strong> 7nm 이하 공정 수요 증가</li>
                        <li>• <strong>경쟁사 동향:</strong> TSMC, 삼성의 EUV 도입</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-300">
                      <p className="text-xs text-yellow-800">
                        <strong>딜레마:</strong> 안전한 DUV로 가서 후발주자가 될 것인가, 
                        위험하지만 EUV로 선도할 것인가?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-800 mb-3">생산성 vs 품질의 균형점</h5>
                  <div className="text-sm text-gray-700 space-y-3">
                    <p className="mb-3">
                      <strong>Stepper vs Scanner, 어떤 노광 방식을 선택할 것인가?</strong>
                    </p>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="font-medium text-green-900 mb-2">실제 제조 현장의 고민:</p>
                      <ul className="text-xs space-y-1 text-green-800">
                        <li>• <strong>소량 다품종:</strong> 연구용, 특수 칩 → Stepper?</li>
                        <li>• <strong>대량 생산:</strong> 메모리, 프로세서 → Scanner?</li>
                        <li>• <strong>수율 문제:</strong> Stepper가 안정적이지만 처리량 한계</li>
                        <li>• <strong>비용 압박:</strong> Scanner가 경제적이지만 복잡함</li>
                        <li>• <strong>납기 일정:</strong> 고객이 요구하는 빠른 양산</li>
                      </ul>
                    </div>
                    <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-300">
                      <p className="text-xs text-blue-800">
                        <strong>현실:</strong> 대부분의 회사는 혼합 전략을 사용. 
                        R&D용 Stepper + 양산용 Scanner 조합으로 리스크 분산
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h6 className="font-semibold text-red-800 mb-2">💰 숨겨진 비용 이야기</h6>
                <div className="text-sm text-red-700 space-y-2">
                  <p>
                    <strong>EUV 스캐너 1대 가격:</strong> 약 2억 달러 (3000억원)
                  </p>
                  <p>
                    <strong>하지만 진짜 비용은:</strong> 마스크 제작비(1억원/개), 클린룸 인프라, 
                    전문 인력 양성, 유지보수(연간 수십억원), 수율 향상 기간...
                  </p>
                  <p>
                    <strong>결론:</strong> 장비 구매는 시작일 뿐, 진짜 게임은 그 이후에 시작됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-indigo-800 mb-4">📊 공정 결과 분석</h3>
              <p className="text-gray-700">
                설정한 Recipe 조건에 따른 결과를 분석하고 최적화 방향을 확인하세요.
              </p>
            </div>

            {processResults.prThickness > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold mb-4">주요 결과 지표</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">PR 두께</span>
                      <span className="text-lg font-bold text-blue-600">
                        {processResults.prThickness.toFixed(0)} nm
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">해상도</span>
                      <span className="text-lg font-bold text-green-600">
                        {processResults.resolution.toFixed(1)} %
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium">균일도</span>
                      <span className="text-lg font-bold text-purple-600">
                        {processResults.uniformity.toFixed(1)} %
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="font-medium">결함 밀도</span>
                      <span className="text-lg font-bold text-red-600">
                        {processResults.defectDensity.toFixed(1)} /cm²
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium">CD 균일도</span>
                      <span className="text-lg font-bold text-orange-600">
                        {processResults.cdUniformity.toFixed(1)} %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold mb-4">성능 지표 차트</h4>
                  
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: '해상도', value: processResults.resolution, fill: '#3b82f6' },
                          { name: '균일도', value: processResults.uniformity, fill: '#8b5cf6' },
                          { name: 'CD균일도', value: processResults.cdUniformity, fill: '#f59e0b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
                  <h4 className="text-lg font-semibold mb-4">Recipe 최적화 가이드</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-2">1단계 최적화</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        현재 설정: {processParams.step1_rpm} RPM × {processParams.step1_time}초
                      </p>
                      <p className="text-xs text-gray-600">
                        최적 범위: 400-600 RPM, 4초 이상<br/>
                        PR 분산 효과를 위한 중간 속도
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">2단계 최적화</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        현재 설정: {processParams.step2_rpm} RPM × {processParams.step2_time}초
                      </p>
                      <p className="text-xs text-gray-600">
                        최적 범위: 2500-4000 RPM, 20초 이상<br/>
                        균일한 두께를 위한 적절한 속도와 시간
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h5 className="font-semibold text-purple-800 mb-2">3단계 최적화</h5>
                      <p className="text-sm text-gray-700 mb-2">
                        현재 설정: {processParams.step3_rpm} RPM × {processParams.step3_time}초
                      </p>
                      <p className="text-xs text-gray-600">
                        최적 설정: 0 RPM, 2초 이상<br/>
                        완전 정지로 안정화 시간 확보
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-700">분석할 데이터가 없습니다</h4>
                  <p className="text-gray-600">공정 실습 탭에서 Recipe를 실행해주세요.</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-purple-800 mb-4">📝 포토리소그라피 학습 평가</h3>
              <p className="text-gray-700">
                학습한 내용을 바탕으로 퀴즈를 풀어보세요.
              </p>
            </div>

            {!showResults ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      문제 {currentQuestion + 1} / {quizQuestions.length}
                    </span>
                    <span className="text-sm font-medium text-purple-600">
                      점수: {score} / {quizQuestions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4">
                    {quizQuestions[currentQuestion].question}
                  </h4>
                  
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <label key={index} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="answer"
                          value={index.toString()}
                          checked={selectedAnswer === index.toString()}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="mr-3 w-4 h-4 text-purple-600"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {currentQuestion < quizQuestions.length - 1 ? '다음 문제' : '결과 보기'}
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h4 className="text-2xl font-bold mb-4">퀴즈 완료!</h4>
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  {score} / {quizQuestions.length}
                </div>
                <div className="text-lg mb-6">
                  정답률: {((score / quizQuestions.length) * 100).toFixed(0)}%
                </div>
                
                <div className="text-left mb-6 max-w-2xl mx-auto">
                  <h5 className="font-semibold mb-3">성과 평가:</h5>
                  {score === quizQuestions.length && (
                    <p className="text-green-600 p-3 bg-green-50 rounded-lg">
                      완벽합니다! 포토리소그라피 공정을 완전히 이해했습니다. 
                      이론과 실습을 통해 습득한 지식을 실제 공정에 적용할 수 있을 것입니다.
                    </p>
                  )}
                  {score >= quizQuestions.length * 0.8 && score < quizQuestions.length && (
                    <p className="text-blue-600 p-3 bg-blue-50 rounded-lg">
                      우수합니다! 대부분의 개념을 잘 이해했습니다. 
                      몇 가지 세부 사항을 더 복습하면 완벽할 것입니다.
                    </p>
                  )}
                  {score >= quizQuestions.length * 0.6 && score < quizQuestions.length * 0.8 && (
                    <p className="text-yellow-600 p-3 bg-yellow-50 rounded-lg">
                      양호합니다. 기본 개념은 이해했지만, 
                      공정 세부사항과 원리에 대해 더 학습이 필요합니다.
                    </p>
                  )}
                  {score < quizQuestions.length * 0.6 && (
                    <p className="text-red-600 p-3 bg-red-50 rounded-lg">
                      더 학습이 필요합니다. 개요 탭과 공정 실습을 통해 
                      기본 개념부터 차근차근 다시 학습해보세요.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer('');
                    setScore(0);
                    setShowResults(false);
                  }}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  다시 도전하기
                </button>
              </div>
            )}
          </div>
        );

      default:
        return <div>탭을 선택해주세요.</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
      
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PhotolithographySimulator;
