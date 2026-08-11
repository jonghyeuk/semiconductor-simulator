import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 물리 계산 모듈만 대상으로 한다. 컴포넌트 렌더 테스트는 CRA/jest 쪽(`npm run test:cra`).
    include: ['src/physics/**/*.test.js'],
    environment: 'node',
    reporters: 'default',
  },
});
