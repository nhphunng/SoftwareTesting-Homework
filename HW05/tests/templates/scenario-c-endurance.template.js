import { setupScenarioC, executeScenarioC } from '../../lib/scenario-c.js';
import { commonOptions, requiredDuration, requiredInteger } from '../../lib/workload-config.js';

export const options = commonOptions('scenario_c_endurance', {
  executor: 'constant-vus',
  vus: requiredInteger('ENDURANCE_VUS'),
  duration: requiredDuration('ENDURANCE_DURATION'),
  gracefulStop: requiredDuration('GRACEFUL_STOP'),
});

export const setup = setupScenarioC;
export default executeScenarioC;
