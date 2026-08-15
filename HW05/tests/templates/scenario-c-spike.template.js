import { setupScenarioC, executeScenarioC } from '../../lib/scenario-c.js';
import { commonOptions, requiredDuration, requiredInteger } from '../../lib/workload-config.js';

export const options = commonOptions('scenario_c_spike', {
  executor: 'ramping-vus',
  gracefulRampDown: requiredDuration('GRACEFUL_RAMP_DOWN'),
  stages: [
    { duration: requiredDuration('SPIKE_BASELINE_RAMP'), target: requiredInteger('SPIKE_BASELINE_VUS') },
    { duration: requiredDuration('SPIKE_BASELINE_HOLD'), target: requiredInteger('SPIKE_BASELINE_VUS') },
    { duration: requiredDuration('SPIKE_RAMP_UP'), target: requiredInteger('SPIKE_VUS') },
    { duration: requiredDuration('SPIKE_HOLD'), target: requiredInteger('SPIKE_VUS') },
    { duration: requiredDuration('SPIKE_RAMP_DOWN'), target: requiredInteger('SPIKE_RECOVERY_VUS') },
    { duration: requiredDuration('SPIKE_RECOVERY_HOLD'), target: requiredInteger('SPIKE_RECOVERY_VUS') },
    { duration: requiredDuration('SPIKE_COOLDOWN'), target: 0 },
  ],
});

export const setup = setupScenarioC;
export default executeScenarioC;
