// 시뮬레이터 등록 및 관리 시스템
import VacuumSimulator from '../simulators/VacuumSimulator';
// 미래에 추가될 시뮬레이터들
import CleaningSimulator from '../simulators/CleaningSimulator';
import OxidationSimulator from '../simulators/Oxidation';
import PlasmaSimulator from '../simulators/PlasmaSimulator';
import PlasmaSimulatorII from '../simulators/PlasmaSimulatorII'; // ← 새로 추가
// import EtchingSimulator from '../simulators/EtchingSimulator';
// import DepositionSimulator from '../simulators/DepositionSimulator';

class SimulatorRegistry {
  constructor() {
    this.simulators = new Map();
    this.initializeSimulators();
  }

  // 시뮬레이터 초기화
  initializeSimulators() {
    // 진공 시뮬레이터 (현재 완성됨)
    this.register({
      id: 'vacuum',
      name: 'Vacuum 기초',
      icon: '⚡',
      description: '진공 펌핑 및 성능 분석',
      component: VacuumSimulator,
      available: true,
      category: 'basic',
      order: 1,
      metadata: {
        version: '1.0.0',
        lastUpdated: '2025-01-01',
        author: 'Semiconductor Simulator Team',
        features: [
          '실시간 펌핑 시뮬레이션',
          '성능 특성 곡선 분석',
          '공정 압력 세팅 실험',
          'Conductance & 압력 관계',
          '배관 설계 최적화',
          '진공 기술 퀴즈'
        ]
      }
    });

    // 웨이퍼 세정 시뮬레이터 (완성됨)
    this.register({
      id: 'cleaning',
      name: '웨이퍼 세정',
      icon: '🧽',
      description: 'RCA 세정 및 표면 처리',
      component: CleaningSimulator,
      available: true,
      category: 'process',
      order: 2,
      metadata: {
        version: '1.0.0',
        lastUpdated: '2025-01-23',
        author: 'Semiconductor Simulator Team',
        features: [
          '세정 공정 개요 및 전략',
          '습식 세정 실시간 시뮬레이션',
          '건식 세정 방법 비교',
          '초음파 세정 캐비테이션 효과',
          '웨이퍼 단면 제거 과정 시각화',
          '중급 수준 세정 평가 퀴즈'
        ]
      }
    });

    // Oxidation 시뮬레이터 (준비중)
    this.register({
      id: 'oxidation',
      name: 'Oxidation',
      icon: '🔥',
      description: '열산화 및 게이트 절연막',
      component: OxidationSimulator,
      available: true,
      category: 'process',
      order: 3,
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-02-15',
        features: [
          '건식/습식 산화',
          'Deal-Grove 모델',
          '온도/시간 최적화',
          '막질 특성 분석'
        ]
      }
    });

    // Lithography 시뮬레이터 (준비중)
    this.register({
      id: 'lithograph',
      name: 'Lithograph',
      icon: '💡',
      description: '포토리소그래피 공정',
      component: null,
      available: false,
      category: 'process',
      order: 4,
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-03-01',
        features: [
          '노광 공정 시뮬레이션',
          '현상 및 패턴 형성',
          '해상도 및 CD 제어',
          'Overlay 정확도'
        ]
      }
    });

    // Plasma Simulation I 시뮬레이터 (완성됨)
    this.register({
      id: 'plasma',
      name: 'Plasma Simulation I',
      icon: '⚡',
      description: '플라즈마 발생원리 및 공정 제어',
      component: PlasmaSimulator,
      available: true,
      category: 'process',
      order: 5,
      metadata: {
        version: '1.0.0',
        lastUpdated: '2025-01-29',
        author: 'Semiconductor Simulator Team',
        features: [
          '플라즈마 기본 특성 이해',
          '발생원리 및 파션커브',
          'RF 매칭 네트워크',
          'CCP 시스템 구조',
          '고급 주제 및 미래 기술'
        ]
      }
    });

    // Plasma Simulation II 시뮬레이터 (완성됨) ← 새로 추가
    this.register({
      id: 'plasma-ii',
      name: 'Plasma Simulation II',
      icon: '🔬',
      description: 'ICP 시스템 및 고급 식각 공정',
      component: PlasmaSimulatorII,
      available: true,
      category: 'process',
      order: 6, // ← Plasma I 바로 다음
      metadata: {
        version: '1.0.0',
        lastUpdated: '2025-01-30',
        author: 'Semiconductor Simulator Team',
        features: [
          'ICP 유도결합 원리 4단계 프로세스',
          'Synergy Effect 실험 시뮬레이션',
          '식각 메커니즘 상세 분석',
          '산업별 플라즈마 응용 분야',
          '난이도별 개념 확인 퀴즈 (30문제)',
          '실시간 애니메이션 및 타이핑 효과'
        ]
      }
    });

    // Etching 시뮬레이터 (준비중)
    this.register({
      id: 'etching',
      name: 'Etching',
      icon: '⚗️',
      description: '건식/습식 식각 공정',
      component: null,
      available: false,
      category: 'process',
      order: 7, // ← 순서 조정: 6 → 7
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-03-15',
        features: [
          '플라즈마 식각',
          '선택비 및 이방성',
          '프로파일 제어',
          '식각 균일도'
        ]
      }
    });

    // Deposition 시뮬레이터 (준비중)
    this.register({
      id: 'deposition',
      name: 'Deposition',
      icon: '📦',
      description: '박막 증착 공정',
      component: null,
      available: false,
      category: 'process',
      order: 8, // ← 순서 조정: 7 → 8
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-04-01',
        features: [
          'CVD/PVD 공정',
          '증착속도 제어',
          '막질 및 스텝커버리지',
          '응력 및 접착력'
        ]
      }
    });

    // Implantation 시뮬레이터 (준비중)
    this.register({
      id: 'implantation',
      name: 'Implantation',
      icon: '⚛️',
      description: '이온주입 및 도핑',
      component: null,
      available: false,
      category: 'process',
      order: 9, // ← 순서 조정: 8 → 9
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-04-15',
        features: [
          '이온주입 프로파일',
          '어닐링 및 활성화',
          '도즈량 최적화',
          '채널링 효과'
        ]
      }
    });

    // 검사계측 시뮬레이터 (준비중)
    this.register({
      id: 'inspection',
      name: '검사계측',
      icon: '🔍',
      description: '측정 및 품질 관리',
      component: null,
      available: false,
      category: 'metrology',
      order: 10, // ← 순서 조정: 9 → 10
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-05-01',
        features: [
          '막두께 측정',
          '결함 검출',
          'CD-SEM 분석',
          '통계적 공정관리'
        ]
      }
    });

    // 패키징 시뮬레이터 (준비중)
    this.register({
      id: 'packaging',
      name: '패키징',
      icon: '📱',
      description: '조립 및 테스트',
      component: null,
      available: false,
      category: 'backend',
      order: 11, // ← 순서 조정: 10 → 11
      metadata: {
        version: '0.0.0',
        estimatedRelease: '2025-05-15',
        features: [
          '다이싱 및 본딩',
          '열관리 설계',
          '신뢰성 테스트',
          '패키지 최적화'
        ]
      }
    });
  }

  // 시뮬레이터 등록
  register(simulatorConfig) {
    if (!simulatorConfig.id || !simulatorConfig.name) {
      throw new Error('시뮬레이터는 id와 name이 필수입니다.');
    }

    this.simulators.set(simulatorConfig.id, {
      ...simulatorConfig,
      registeredAt: new Date()
    });
  }

  // 특정 시뮬레이터 가져오기
  getSimulator(id) {
    const simulator = this.simulators.get(id);
    return simulator?.available ? simulator.component : null;
  }

  // 시뮬레이터 메타데이터 가져오기
  getSimulatorInfo(id) {
    return this.simulators.get(id);
  }

  // 모든 시뮬레이터 목록 (정렬됨)
  getAllSimulators() {
    return Array.from(this.simulators.values())
      .sort((a, b) => a.order - b.order);
  }

  // 사용 가능한 시뮬레이터만
  getAvailableSimulators() {
    return Array.from(this.simulators.values())
      .filter(sim => sim.available)
      .sort((a, b) => a.order - b.order);
  }

  // 카테고리별 시뮬레이터
  getSimulatorsByCategory(category) {
    return Array.from(this.simulators.values())
      .filter(sim => sim.category === category)
      .sort((a, b) => a.order - b.order);
  }

  // 개발 통계
  getDevStats() {
    const all = Array.from(this.simulators.values());
    return {
      total: all.length,
      available: all.filter(s => s.available).length,
      inDevelopment: all.filter(s => !s.available).length,
      categories: [...new Set(all.map(s => s.category))],
      latestRelease: all
        .filter(s => s.available)
        .sort((a, b) => new Date(b.metadata?.lastUpdated || 0) - new Date(a.metadata?.lastUpdated || 0))[0]
    };
  }
}

// 싱글톤 인스턴스 생성
export const simulatorRegistry = new SimulatorRegistry();

// 개발자 유틸리티 함수들
export const devUtils = {
  // 새 시뮬레이터 추가 헬퍼
  createSimulatorTemplate: (id, name, icon) => ({
    id,
    name,
    icon,
    description: '설명을 입력하세요',
    component: null,
    available: false,
    category: 'process',
    order: 999,
    metadata: {
      version: '0.0.0',
      features: []
    }
  }),

  // 시뮬레이터 상태 변경
  markAsAvailable: (id, component) => {
    const sim = simulatorRegistry.simulators.get(id);
    if (sim) {
      sim.available = true;
      sim.component = component;
      sim.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    }
  },

  // 개발 현황 출력
  logDevProgress: () => {
    const stats = simulatorRegistry.getDevStats();
    console.log('🚀 시뮬레이터 개발 현황');
    console.log(`✅ 완성: ${stats.available}/${stats.total}`);
    console.log(`🔧 개발중: ${stats.inDevelopment}`);
    console.log(`📂 카테고리: ${stats.categories.join(', ')}`);
    if (stats.latestRelease) {
      console.log(`🆕 최신: ${stats.latestRelease.name} (${stats.latestRelease.metadata?.lastUpdated})`);
    }
  }
};
