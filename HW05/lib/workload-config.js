const VALIDATION_MODE = __ENV.SKELETON_VALIDATE === 'true';

export function requiredInteger(name, validationValue = 1) {
  const rawValue = __ENV[name];
  if (!rawValue && VALIDATION_MODE) return validationValue;
  if (!rawValue) throw new Error(`Missing required integer environment variable: ${name}`);

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer.`);
  }
  return value;
}

export function requiredDuration(name, validationValue = '1s') {
  const value = __ENV[name];
  if (!value && VALIDATION_MODE) return validationValue;
  if (!value) throw new Error(`Missing required duration environment variable: ${name}`);
  if (!/^\d+(?:\.\d+)?(?:ms|s|m|h)$/.test(value)) {
    throw new Error(`${name} must use a k6 duration such as 30s, 5m, or 1h.`);
  }
  return value;
}

export function commonOptions(scenarioName, scenario) {
  return {
    scenarios: { [scenarioName]: scenario },
    thresholds: {},
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
    systemTags: ['status', 'method', 'url', 'name', 'group', 'scenario'],
  };
}
