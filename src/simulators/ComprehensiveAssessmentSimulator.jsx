import React, { useState } from 'react';

const ComprehensiveAssessmentSimulator = () => {
  const [activeLevel, setActiveLevel] = useState(null); // null, 'basic', 'advanced'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);

  // 기초 레벨 15문제 (진공, 세정, 산화, 리소그라피)
  const basicQuestions = [
    // 진공 (Vacuum) - 3문제
    {
      q: "반도체 공정에서 진공이 필요한 가장 중요한 이유는?",
      opts: ["비용 절감", "오염 방지 및 평균자유행로 확보", "온도 조절", "장비 수명 연장"],
      ans: 1,
      exp: "진공은 파티클과 불순물 오염을 방지하고, 분자의 평균자유행로(MFP)를 확보하여 공정 효율을 높입니다.",
      topic: "진공"
    },
    {
      q: "Turbo Molecular Pump(TMP)의 주요 작동 원리는?",
      opts: ["기체 흡착", "고속 회전 블레이드로 운동량 전달", "화학 반응", "온도 차이"],
      ans: 1,
      exp: "TMP는 고속 회전하는 블레이드가 기체 분자에 운동량을 전달하여 배기합니다.",
      topic: "진공"
    },
    {
      q: "고진공 영역의 압력 범위는?",
      opts: ["760 ~ 1 Torr", "1 ~ 10⁻³ Torr", "10⁻³ ~ 10⁻⁸ Torr", "10⁻⁸ Torr 이하"],
      ans: 2,
      exp: "고진공(High Vacuum)은 10⁻³ ~ 10⁻⁸ Torr 범위이며, 대부분의 반도체 공정이 이 영역에서 진행됩니다.",
      topic: "진공"
    },
    // 세정 (Cleaning) - 3문제
    {
      q: "RCA 세정에서 SC-1 용액의 주요 목적은?",
      opts: ["금속 이온 제거", "유기물 및 파티클 제거", "자연 산화막 제거", "PR 제거"],
      ans: 1,
      exp: "SC-1(NH₄OH + H₂O₂ + H₂O)은 유기물 오염과 파티클을 제거합니다.",
      topic: "세정"
    },
    {
      q: "DHF(Diluted HF) 세정의 주요 역할은?",
      opts: ["유기물 제거", "금속 오염 제거", "자연 산화막(Native Oxide) 제거", "파티클 제거"],
      ans: 2,
      exp: "DHF는 실리콘 표면의 자연 산화막을 제거하여 다음 공정을 위한 깨끗한 표면을 준비합니다.",
      topic: "세정"
    },
    {
      q: "메가소닉 세정에서 사용하는 주파수 범위는?",
      opts: ["20 ~ 40 kHz", "100 ~ 200 kHz", "700 kHz ~ 1 MHz", "10 ~ 20 MHz"],
      ans: 2,
      exp: "메가소닉은 700kHz~1MHz 주파수를 사용하여 미세 패턴 손상 없이 파티클을 제거합니다.",
      topic: "세정"
    },
    // 산화 (Oxidation) - 3문제
    {
      q: "습식 산화(Wet Oxidation)가 건식 산화보다 빠른 이유는?",
      opts: ["온도가 더 높아서", "H₂O 분자의 확산 속도가 O₂보다 빨라서", "압력이 더 높아서", "촉매를 사용해서"],
      ans: 1,
      exp: "H₂O 분자가 O₂보다 SiO₂ 막 내에서 확산 속도가 빨라 산화 속도가 더 빠릅니다.",
      topic: "산화"
    },
    {
      q: "Deal-Grove 모델에서 선형 영역(Linear Region)의 특징은?",
      opts: ["확산이 율속 단계", "표면 반응이 율속 단계", "두꺼운 산화막", "고온에서만 적용"],
      ans: 1,
      exp: "선형 영역은 얇은 막에서 표면 반응이 율속 단계이며, t ∝ x 관계를 보입니다.",
      topic: "산화"
    },
    {
      q: "게이트 산화막에 건식 산화를 선호하는 이유는?",
      opts: ["빠른 성장 속도", "우수한 막질과 계면 특성", "낮은 온도", "저렴한 비용"],
      ans: 1,
      exp: "건식 산화는 느리지만 결함이 적고 Si/SiO₂ 계면 특성이 우수하여 게이트 산화막에 적합합니다.",
      topic: "산화"
    },
    // 리소그라피 (Lithography) - 3문제
    {
      q: "EUV 리소그라피의 파장은?",
      opts: ["365nm", "248nm", "193nm", "13.5nm"],
      ans: 3,
      exp: "EUV(Extreme Ultra Violet)는 13.5nm 파장을 사용하여 7nm 이하 미세 공정을 가능하게 합니다.",
      topic: "리소"
    },
    {
      q: "포토레지스트(PR)의 Positive/Negative 타입 차이는?",
      opts: ["두께 차이", "노광 후 용해성 변화 방향", "색상 차이", "점도 차이"],
      ans: 1,
      exp: "Positive PR은 노광부가 용해되고, Negative PR은 노광부가 경화되어 남습니다.",
      topic: "리소"
    },
    {
      q: "해상도(Resolution) 향상을 위한 Rayleigh 식에서 k₁ 값을 줄이는 방법이 아닌 것은?",
      opts: ["OPC (Optical Proximity Correction)", "PSM (Phase Shift Mask)", "파장 증가", "다중 패터닝"],
      ans: 2,
      exp: "파장(λ)을 줄이면 해상도가 향상됩니다. k₁을 줄이는 RET 기술로는 OPC, PSM 등이 있습니다.",
      topic: "리소"
    },
    // 플라즈마 기초 - 3문제
    {
      q: "플라즈마 상태의 정의로 올바른 것은?",
      opts: ["고체가 승화된 상태", "이온화된 기체 상태", "액체가 기화된 상태", "초임계 유체 상태"],
      ans: 1,
      exp: "플라즈마는 기체가 이온화되어 양이온, 전자, 중성 입자가 공존하는 제4의 물질 상태입니다.",
      topic: "플라즈마"
    },
    {
      q: "Paschen 곡선에서 방전 전압이 최소가 되는 조건은?",
      opts: ["압력 × 거리(pd) 값이 최적일 때", "압력이 최소일 때", "거리가 최대일 때", "온도가 최고일 때"],
      ans: 0,
      exp: "Paschen 곡선에서 pd(압력×거리)가 특정 값일 때 방전 전압이 최소화됩니다.",
      topic: "플라즈마"
    },
    {
      q: "CCP(Capacitively Coupled Plasma)의 특징은?",
      opts: ["높은 이온 밀도, 낮은 이온 에너지", "낮은 이온 밀도, 높은 이온 에너지", "높은 이온 밀도, 높은 이온 에너지", "낮은 이온 밀도, 낮은 이온 에너지"],
      ans: 1,
      exp: "CCP는 ICP 대비 이온 밀도는 낮지만, 이온 에너지가 높아 물리적 식각에 유리합니다.",
      topic: "플라즈마"
    }
  ];

  // 심화 레벨 15문제 (플라즈마II, 식각, 증착, 도핑, 배선/EDS/패키징)
  const advancedQuestions = [
    // 플라즈마 II (ICP, 고급) - 3문제
    {
      q: "ICP(Inductively Coupled Plasma)가 CCP보다 이온 밀도가 높은 이유는?",
      opts: ["전극 면적이 넓어서", "유도 전기장으로 전자 가속이 효율적이어서", "압력이 높아서", "RF 주파수가 낮아서"],
      ans: 1,
      exp: "ICP는 유도 전기장으로 전자를 가속하여 높은 이온화 효율과 이온 밀도(10¹¹~10¹²/cm³)를 달성합니다.",
      topic: "플라즈마II"
    },
    {
      q: "플라즈마 식각에서 Synergy Effect란?",
      opts: ["물리적 식각만 사용", "화학적 식각만 사용", "물리+화학 식각의 상승효과", "온도 효과"],
      ans: 2,
      exp: "Synergy Effect는 이온 충격(물리)과 라디칼 반응(화학)이 결합하여 각각의 합보다 큰 식각률을 보이는 현상입니다.",
      topic: "플라즈마II"
    },
    {
      q: "고밀도 플라즈마에서 플라즈마 전위(Plasma Potential) 특성은?",
      opts: ["항상 음전위", "항상 양전위", "0V", "교류 전위"],
      ans: 1,
      exp: "전자의 높은 이동도로 인해 플라즈마는 주변보다 높은 양전위를 유지합니다.",
      topic: "플라즈마II"
    },
    // 식각 (Etching) - 3문제
    {
      q: "이방성 식각(Anisotropic Etching)을 위해 중요한 요소는?",
      opts: ["등방성 화학 반응", "수직 방향 이온 충격", "높은 온도", "낮은 압력만"],
      ans: 1,
      exp: "이방성 식각은 수직 방향 이온 충격이 측벽 보호막과 함께 수직 프로파일을 형성합니다.",
      topic: "식각"
    },
    {
      q: "선택비(Selectivity)의 정의는?",
      opts: ["식각 속도 / 증착 속도", "마스크 식각률 / 타겟 식각률", "타겟 식각률 / 하부막 식각률", "화학 반응률 / 물리 반응률"],
      ans: 2,
      exp: "선택비 = 타겟 물질 식각률 / 마스크(또는 하부막) 식각률로, 높을수록 좋습니다.",
      topic: "식각"
    },
    {
      q: "실리콘 식각에서 SF₆와 C₄F₈을 함께 사용하는 Bosch 공정의 특징은?",
      opts: ["연속 식각", "식각-보호 반복 사이클", "등방성 식각", "화학적 식각만"],
      ans: 1,
      exp: "Bosch 공정은 SF₆ 식각과 C₄F₈ 측벽 보호를 번갈아 수행하여 깊은 수직 식각을 구현합니다.",
      topic: "식각"
    },
    // 증착 (Deposition) - 3문제
    {
      q: "ALD(Atomic Layer Deposition)의 자기제한 성장(Self-limiting)이란?",
      opts: ["무한 성장", "표면 반응 사이트 포화 후 성장 정지", "시간에 비례한 성장", "온도에 비례한 성장"],
      ans: 1,
      exp: "ALD는 표면 반응 사이트가 포화되면 추가 전구체가 반응하지 않아 단원자층만 성장합니다.",
      topic: "증착"
    },
    {
      q: "스퍼터링에서 Step Coverage를 개선하는 방법이 아닌 것은?",
      opts: ["Collimator 사용", "이온화 스퍼터링(Ionized PVD)", "기판 가열", "타겟 전력 감소"],
      ans: 3,
      exp: "타겟 전력 감소는 증착률을 낮출 뿐, Step Coverage 개선에 직접적 영향이 없습니다.",
      topic: "증착"
    },
    {
      q: "PECVD가 Thermal CVD보다 저온 공정이 가능한 이유는?",
      opts: ["높은 압력", "플라즈마 에너지가 반응 활성화", "촉매 사용", "자외선 조사"],
      ans: 1,
      exp: "PECVD는 플라즈마 에너지로 반응을 활성화하여 300~400°C에서도 증착이 가능합니다.",
      topic: "증착"
    },
    // 도핑 (Implantation) - 3문제
    {
      q: "이온주입에서 Channeling 현상을 방지하는 방법은?",
      opts: ["에너지 증가", "웨이퍼 틸트(7°) 적용", "도즈량 감소", "온도 증가"],
      ans: 1,
      exp: "웨이퍼를 7° 틸트하면 결정 채널 방향을 피해 불필요한 깊은 주입을 방지합니다.",
      topic: "도핑"
    },
    {
      q: "이온주입 후 Annealing의 주요 목적은?",
      opts: ["도펀트 확산만", "결정 손상 회복 및 도펀트 활성화", "산화막 성장", "세정"],
      ans: 1,
      exp: "Annealing은 이온주입으로 발생한 결정 손상을 회복하고 도펀트를 격자 위치에 활성화합니다.",
      topic: "도핑"
    },
    {
      q: "LSS 이론에서 투영 비정(Rp)에 영향을 주는 요소는?",
      opts: ["도즈량만", "이온 에너지와 질량", "기판 온도만", "빔 전류만"],
      ans: 1,
      exp: "Rp는 이온 에너지에 비례하고 이온 질량에 반비례합니다. 도즈량은 농도에 영향을 줍니다.",
      topic: "도핑"
    },
    // 배선/EDS/패키징 - 3문제
    {
      q: "Cu Damascene 공정에서 TaN/Ta 배리어의 역할은?",
      opts: ["Cu 산화 방지", "Cu의 Si/SiO₂ 확산 방지", "전도성 향상", "접착력 감소"],
      ans: 1,
      exp: "Cu가 Si/SiO₂로 확산되면 누설전류 증가 등 소자 특성이 열화되므로 배리어가 필수입니다.",
      topic: "배선"
    },
    {
      q: "EDS(Electrical Die Sorting) 공정의 주요 목적이 아닌 것은?",
      opts: ["양품/불량 선별", "수선 가능 칩 양품화", "공정 피드백", "다이싱 수행"],
      ans: 3,
      exp: "다이싱은 패키징 공정의 일부이며, EDS는 웨이퍼 레벨에서 전기적 검사를 수행합니다.",
      topic: "EDS"
    },
    {
      q: "2.5D 패키징에서 인터포저(Interposer)의 역할은?",
      opts: ["열 방출만", "여러 다이 간 고밀도 연결", "전력 공급만", "패키지 보호만"],
      ans: 1,
      exp: "실리콘 인터포저는 미세 배선으로 여러 칩렛을 고밀도로 연결하는 중간층 역할을 합니다.",
      topic: "패키징"
    }
  ];

  const currentQuestions = activeLevel === 'basic' ? basicQuestions : advancedQuestions;

  const handleAnswerSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = index;
    setAnswers(newAnswers);
    if (index === currentQuestions[currentQuestion].ans) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const startQuiz = (level) => {
    setActiveLevel(level);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setAnswers([]);
  };

  const resetQuiz = () => {
    setActiveLevel(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setAnswers([]);
  };

  const getGrade = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { grade: 'A+', color: 'text-emerald-600', emoji: '🏆' };
    if (percentage >= 80) return { grade: 'A', color: 'text-emerald-500', emoji: '🥇' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-500', emoji: '🥈' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', emoji: '🥉' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500', emoji: '📚' };
    return { grade: 'F', color: 'text-red-500', emoji: '💪' };
  };

  // 메인 선택 화면
  const renderMainScreen = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2">🏆 반도체 공정 종합평가</h2>
        <p className="opacity-90">전체 공정의 핵심 개념을 테스트합니다</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => startQuiz('basic')}
          className="bg-white border-2 border-green-400 rounded-xl p-6 hover:bg-green-50 hover:border-green-500 transition-all shadow-md"
        >
          <div className="text-4xl mb-3">📗</div>
          <div className="text-xl font-bold text-green-700">기초 레벨</div>
          <div className="text-sm text-gray-500 mt-2">15문제</div>
          <div className="text-xs text-gray-400 mt-1">진공 · 세정 · 산화 · 리소 · 플라즈마</div>
          <div className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold">
            시작하기
          </div>
        </button>

        <button
          onClick={() => startQuiz('advanced')}
          className="bg-white border-2 border-purple-400 rounded-xl p-6 hover:bg-purple-50 hover:border-purple-500 transition-all shadow-md"
        >
          <div className="text-4xl mb-3">📕</div>
          <div className="text-xl font-bold text-purple-700">심화 레벨</div>
          <div className="text-sm text-gray-500 mt-2">15문제</div>
          <div className="text-xs text-gray-400 mt-1">플라즈마II · 식각 · 증착 · 도핑 · 배선</div>
          <div className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-bold">
            시작하기
          </div>
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-bold text-gray-700 mb-3">📊 출제 범위</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-semibold text-green-600 mb-2">기초 레벨 (15문제)</div>
            <ul className="space-y-1 text-gray-600">
              <li>• 진공 기초 (3문제)</li>
              <li>• 웨이퍼 세정 (3문제)</li>
              <li>• 열산화 공정 (3문제)</li>
              <li>• 리소그라피 (3문제)</li>
              <li>• 플라즈마 기초 (3문제)</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-purple-600 mb-2">심화 레벨 (15문제)</div>
            <ul className="space-y-1 text-gray-600">
              <li>• 플라즈마 심화/ICP (3문제)</li>
              <li>• 식각 공정 (3문제)</li>
              <li>• 증착 공정 (3문제)</li>
              <li>• 도핑/이온주입 (3문제)</li>
              <li>• 배선/EDS/패키징 (3문제)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <h3 className="font-bold text-indigo-700 mb-2">💡 평가 기준</h3>
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          {[
            { g: 'A+', r: '90%↑', c: 'bg-emerald-100 text-emerald-700' },
            { g: 'A', r: '80%↑', c: 'bg-emerald-50 text-emerald-600' },
            { g: 'B+', r: '70%↑', c: 'bg-blue-100 text-blue-700' },
            { g: 'B', r: '60%↑', c: 'bg-blue-50 text-blue-600' },
            { g: 'C', r: '50%↑', c: 'bg-yellow-100 text-yellow-700' },
            { g: 'F', r: '50%↓', c: 'bg-red-100 text-red-700' }
          ].map((item, i) => (
            <div key={i} className={`p-2 rounded ${item.c}`}>
              <div className="font-bold">{item.g}</div>
              <div>{item.r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 퀴즈 진행 화면
  const renderQuizScreen = () => (
    <div className="space-y-4">
      <div className={`text-white p-4 rounded-lg ${activeLevel === 'basic' ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {activeLevel === 'basic' ? '📗 기초 레벨' : '📕 심화 레벨'}
          </h2>
          <button
            onClick={resetQuiz}
            className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition"
          >
            ✕ 종료
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">
            문제 {currentQuestion + 1} / {currentQuestions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${activeLevel === 'basic' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
              {currentQuestions[currentQuestion].topic}
            </span>
            <span className="text-sm font-bold text-indigo-600">
              점수: {score} / {currentQuestion + (showResult ? 1 : 0)}
            </span>
          </div>
        </div>

        <div className={`rounded-full h-2 mb-4 ${activeLevel === 'basic' ? 'bg-green-100' : 'bg-purple-100'}`}>
          <div
            className={`h-2 rounded-full transition-all ${activeLevel === 'basic' ? 'bg-green-500' : 'bg-purple-500'}`}
            style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
          />
        </div>

        <h3 className="font-bold mb-4 text-gray-800 text-lg">
          Q{currentQuestion + 1}. {currentQuestions[currentQuestion].q}
        </h3>

        <div className="space-y-2">
          {currentQuestions[currentQuestion].opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelect(i)}
              disabled={showResult}
              className={`w-full p-3 rounded-lg border-2 text-left text-sm transition ${
                showResult
                  ? i === currentQuestions[currentQuestion].ans
                    ? 'border-emerald-500 bg-emerald-50'
                    : i === selectedAnswer
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {showResult && i === currentQuestions[currentQuestion].ans && (
                <span className="ml-2 text-emerald-600 font-bold">✓ 정답</span>
              )}
            </button>
          ))}
        </div>

        {showResult && (
          <>
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              selectedAnswer === currentQuestions[currentQuestion].ans
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={selectedAnswer === currentQuestions[currentQuestion].ans ? 'text-emerald-600' : 'text-red-600'}>
                  {selectedAnswer === currentQuestions[currentQuestion].ans ? '✅ 정답입니다!' : '❌ 오답입니다'}
                </span>
              </div>
              <strong>해설:</strong> {currentQuestions[currentQuestion].exp}
            </div>
            <button
              onClick={nextQuestion}
              className={`mt-4 w-full py-3 text-white rounded-lg font-bold transition ${
                activeLevel === 'basic' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {currentQuestion < currentQuestions.length - 1 ? '다음 문제 →' : '결과 보기'}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // 결과 화면
  const renderResultScreen = () => {
    const gradeInfo = getGrade(score, currentQuestions.length);
    const percentage = Math.round((score / currentQuestions.length) * 100);

    return (
      <div className="space-y-4">
        <div className={`text-white p-6 rounded-lg ${activeLevel === 'basic' ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'}`}>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{gradeInfo.emoji}</div>
            <h2 className="text-2xl font-bold">
              {activeLevel === 'basic' ? '기초 레벨' : '심화 레벨'} 완료!
            </h2>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className={`text-6xl font-bold mb-2 ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {score} / {currentQuestions.length}
          </div>
          <div className="text-lg text-gray-500 mb-4">
            정답률: {percentage}%
          </div>

          <div className="text-sm text-gray-600 mb-4">
            {percentage >= 90 ? '훌륭합니다! 완벽에 가까운 성적입니다!' :
             percentage >= 80 ? '잘하셨습니다! 조금만 더 복습하면 완벽해요.' :
             percentage >= 70 ? '좋은 성적입니다. 틀린 문제를 복습해보세요.' :
             percentage >= 60 ? '기본기는 있습니다. 부족한 부분을 보완하세요.' :
             percentage >= 50 ? '더 많은 학습이 필요합니다.' :
             '기초부터 다시 학습해보세요. 화이팅!'}
          </div>

          {/* 문제별 결과 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-sm text-gray-700 mb-3">문제별 결과</h4>
            <div className="grid grid-cols-5 gap-2">
              {answers.map((ans, i) => (
                <div
                  key={i}
                  className={`p-2 rounded text-xs font-bold ${
                    ans === currentQuestions[i].ans
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  Q{i + 1}: {ans === currentQuestions[i].ans ? '○' : '✕'}
                </div>
              ))}
            </div>
          </div>

          {/* 토픽별 성적 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-sm text-gray-700 mb-3">영역별 분석</h4>
            <div className="space-y-2">
              {(() => {
                const topicStats = {};
                currentQuestions.forEach((q, i) => {
                  if (!topicStats[q.topic]) {
                    topicStats[q.topic] = { correct: 0, total: 0 };
                  }
                  topicStats[q.topic].total++;
                  if (answers[i] === q.ans) {
                    topicStats[q.topic].correct++;
                  }
                });
                return Object.entries(topicStats).map(([topic, stats], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs w-20 text-left">{topic}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${stats.correct === stats.total ? 'bg-emerald-500' : stats.correct > 0 ? 'bg-yellow-500' : 'bg-red-400'}`}
                        style={{ width: `${(stats.correct / stats.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs w-12 text-right">{stats.correct}/{stats.total}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startQuiz(activeLevel)}
              className={`flex-1 py-3 text-white rounded-lg font-bold transition ${
                activeLevel === 'basic' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              🔄 다시 도전
            </button>
            <button
              onClick={resetQuiz}
              className="flex-1 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition"
            >
              🏠 레벨 선택
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {!activeLevel && renderMainScreen()}
          {activeLevel && !quizCompleted && renderQuizScreen()}
          {activeLevel && quizCompleted && renderResultScreen()}
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveAssessmentSimulator;
