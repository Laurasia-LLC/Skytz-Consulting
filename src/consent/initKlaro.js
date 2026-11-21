import * as klaro from 'klaro';
import 'klaro/dist/klaro.min.css';
import { buildKlaroConfig } from './klaroConfig';

let activeConfig = buildKlaroConfig();

export function initKlaro(lang) {
  activeConfig = buildKlaroConfig(lang || activeConfig.lang);
  klaro.setup(activeConfig);
}

export function showKlaroSettings() {
  klaro.show(activeConfig, true);
}

if (typeof window !== 'undefined') {
  initKlaro();
  window.klaroShow = showKlaroSettings;
}

export { klaro };