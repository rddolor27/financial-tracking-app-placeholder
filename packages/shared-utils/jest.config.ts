import type { Config } from 'jest';
import baseConfig from '../../jest.config.base';

const config: Config = {
  ...baseConfig,
  displayName: 'shared-utils',
};

export default config;
