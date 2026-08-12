import { setupScenarioC, executeScenarioC } from '../../lib/scenario-c.js';
import { commonOptions, requiredDuration, requiredInteger } from '../../lib/workload-config.js';

export const options = commonOptions('scenario_c_load', {
  executor: 'ramping-vus',
  gracefulRampDown: requiredDuration('GRACEFUL_RAMP_DOWN'),
  stages: [
    { duration: requiredDuration('LOAD_RAMP_UP'), target: requiredInteger('LOAD_VUS') },
    { duration: requiredDuration('LOAD_HOLD'), target: requiredInteger('LOAD_VUS') },
    { duration: requiredDuration('LOAD_RAMP_DOWN'), target: 0 },
  ],
});

export const setup = setupScenarioC;
export default executeScenarioC;
