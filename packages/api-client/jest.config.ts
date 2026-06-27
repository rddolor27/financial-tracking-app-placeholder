import type { Config } from 'jest';
import baseConfig from '../../jest.config.base';

const config: Config = {
  ...baseConfig,
  displayName: 'api-client',
};

export default config;
