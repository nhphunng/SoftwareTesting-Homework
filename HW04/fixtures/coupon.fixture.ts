export function uniqueCouponCode(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

// Add controlled coupon setup and cleanup after confirming the SUT interfaces.

