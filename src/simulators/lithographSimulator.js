import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const LithographySimulator = () => {
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

              {/* 나머지 Step들도 동일한 패턴으로... (간략화) */}
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-400">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">🌀 Step 2: Spin Coating (PR 도포)</h4>
                <p className="text-sm text-gray-700">
                  포토레지스트를 웨이퍼에 균일하게 도포하는 공정입니다. RPM과 시간을 조절하여 원하는 두께를 달성합니다.
                </p>
              </div>

              {/* 추가 Steps... */}
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
                </div>
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
                    </g>
                  )}

                  {animationStep >= 3 && (
                    <g>
                      <path d="M 95 175 L 95 235 M 90 230 L 95 235 L 100 230" stroke="#ff69b4" strokeWidth="4" fill="none" />
                      <path d="M 157 175 L 157 235 M 152 230 L 157 235 L 162 230" stroke="#ff69b4" strokeWidth="4" fill="none" />
                      <rect x="85" y="240" width="20" height="20" fill="#FF9999" fillOpacity="0.8" />
                      <rect x="147" y="240" width="20" height="20" fill="#FF9999" fillOpacity="0.8" />
                    </g>
                  )}

                  {animationStep >= 4 && (
                    <g>
                      <path d="M 220 250 L 320 250" stroke="#F39C12" strokeWidth="3" />
                      <text x="270" y="245" textAnchor="middle" className="text-lg font-bold fill-orange-600">develop</text>
                      <g>
                        <text x="430" y="200" textAnchor="middle" className="text-lg font-bold fill-blue-600">With positive PR</text>
                        <rect x="350" y="280" width="140" height="40" fill="#FFD700" />
                        <rect x="350" y="260" width="140" height="20" fill="#90EE90" />
                        <rect x="350" y="240" width="25" height="20" fill="#FF6B6B" />
                        <rect x="395" y="240" width="20" height="20" fill="#FF6B6B" />
                        <rect x="435" y="240" width="25" height="20" fill="#FF6B6B" />
                        <rect x="475" y="240" width="15" height="20" fill="#FF6B6B" />
                      </g>
                    </g>
                  )}
                </svg>
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
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">측정 결과</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>PR 두께: {processResults.prThickness.toFixed(0)} nm</div>
                        <div>균일도: {processResults.uniformity.toFixed(1)}%</div>
                        <div>해상도: {processResults.resolution.toFixed(1)}%</div>
                        <div>결함 밀도: {processResults.defectDensity.toFixed(1)}/cm²</div>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[{
                        name: '결과',
                        thickness: processResults.prThickness,
                        uniformity: processResults.uniformity,
                        resolution: processResults.resolution
                      }]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="thickness" fill="#3b82f6" name="두께 (nm)" />
                        <Bar dataKey="uniformity" fill="#10b981" name="균일도 (%)" />
                        <Bar dataKey="resolution" fill="#f59e0b" name="해상도 (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
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
              <h4 className="text-lg font-semibold mb-4">노광 방식 선택</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { id: 'duv', name: 'DUV (193nm)', desc: 'ArF 엑시머 레이저' },
                  { id: 'euv', name: 'EUV (13.5nm)', desc: '플라즈마 광원' },
                  { id: 'stepper', name: 'Stepper', desc: '일괄 노광 방식' },
                  { id: 'scanner', name: 'Scanner', desc: '스캔 노광 방식' }
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setExposureType(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      exposureType === type.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h5 className="font-semibold mb-2">{type.name}</h5>
                    <p className="text-sm text-gray-600">{type.desc}</p>
                  </div>
                ))}
              </div>

              {exposureType === 'duv' && (
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <h5 className="font-semibold text-cyan-800 mb-2">DUV 시스템 특징</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 성숙한 기술, 안정적 운영</li>
                    <li>• 28nm~7nm 공정 적용</li>
                    <li>• 다중패터닝 필요</li>
                    <li>• 상대적 저비용</li>
                  </ul>
                </div>
              )}

              {exposureType === 'euv' && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-2">EUV 시스템 특징</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 단일패터닝 가능</li>
                    <li>• 7nm 이하 최첨단 공정</li>
                    <li>• 매우 높은 비용</li>
                    <li>• 낮은 처리량</li>
                  </ul>
                </div>
              )}

              {exposureType === 'stepper' && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Stepper 방식 특징</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 높은 해상도</li>
                    <li>• 작은 칩에 적합</li>
                    <li>• 필드 크기 제한</li>
                    <li>• 낮은 처리량</li>
                  </ul>
                </div>
              )}

              {exposureType === 'scanner' && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Scanner 방식 특징</h5>
                  <ul className="text-sm space-y-1">
                    <li>• 큰 노광 필드</li>
                    <li>• 수차 최소화</li>
                    <li>• 높은 처리량</li>
                    <li>• 현재 주류 방식</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4">기술 성능 비교</h4>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { method: 'DUV ArF', resolution: 85, throughput: 90, cost: 60 },
                  { method: 'EUV', resolution: 98, throughput: 40, cost: 100 },
                  { method: 'E-beam', resolution: 100, throughput: 5, cost: 30 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="resolution" fill="#3b82f6" name="해상도" />
                  <Bar dataKey="throughput" fill="#10b981" name="처리량" />
                  <Bar dataKey="cost" fill="#ef4444" name="비용" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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

export default LithographySimulator;
