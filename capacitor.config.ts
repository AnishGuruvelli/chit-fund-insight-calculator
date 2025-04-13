
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.800d7ea405cf4d4fb6c659695c0f37fc',
  appName: 'chit-fund-insight-calculator',
  webDir: 'dist',
  server: {
    url: 'https://800d7ea4-05cf-4d4f-b6c6-59695c0f37fc.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      androidxCore: '1.6.0',
      androidxAppcompat: '1.3.1',
      androidxWebkit: '1.4.0'
    }
  }
};

export default config;
