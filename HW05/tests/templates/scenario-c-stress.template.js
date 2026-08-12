import { setupScenarioC, executeScenarioC } from '../../lib/scenario-c.js';
import { commonOptions, requiredDuration, requiredInteger } from '../../lib/workload-config.js';

export const options = commonOptions('scenario_c_stress', {
  executor: 'ramping-vus',
  gracefulRampDown: requiredDuration('GRACEFUL_RAMP_DOWN'),
  stages: [
    { duration: requiredDuration('STRESS_BASELINE_RAMP'), target: requiredInteger('STRESS_BASELINE_VUS') },
    { duration: requiredDuration('STRESS_BASELINE_HOLD'), target: requiredInteger('STRESS_BASELINE_VUS') },
    { duration: requiredDuration('STRESS_LEVEL_1_RAMP'), target: requiredInteger('STRESS_LEVEL_1_VUS') },
    { duration: requiredDuration('STRESS_LEVEL_1_HOLD'), target: requiredInteger('STRESS_LEVEL_1_VUS') },
    { duration: requiredDuration('STRESS_LEVEL_2_RAMP'), target: requiredInteger('STRESS_LEVEL_2_VUS') },
    { duration: requiredDuration('STRESS_LEVEL_2_HOLD'), target: requiredInteger('STRESS_LEVEL_2_VUS') },
    { duration: requiredDuration('STRESS_RECOVERY'), target: 0 },
  ],
});

export const setup = setupScenarioC;
export default executeScenarioC;
