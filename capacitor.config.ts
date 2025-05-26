import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anishguruvelli.chitx',
  appName: 'ChitX',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      minSdkVersion: 23,
      targetSdkVersion: 34,
      compileSdkVersion: 34
    }
  }
};

export default config;
