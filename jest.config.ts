import type { Config } from '@jest/types'

const config:Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/*.spec.[jt]s'],
  testTimeout: process.env.CI ? 30000 : 10000
}

export default config