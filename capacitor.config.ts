import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  "appId": 'io.github.himadripathak.twa',
  "appName": 'SafaiKaramchari',
  "webDir": 'dist/bikaner-safai-karamchari',
  "server": {
    "hostname": "himadripathak.github.io/bikaner-safai-karamchari/",
    "androidScheme": 'https',
    "url": "https://himadripathak.github.io/bikaner-safai-karamchari/"
  }
};

export default config;

export interface PluginsConfig {
  AppCapacitor? : {
    enabled? : boolean;
  };
}
