import type { APIRequestContext } from '@playwright/test';
import { expect, test as authTest } from './auth.fixture';

const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

export interface CouponSetup {
  prefix: string;
  type: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  expiredAt: string;
  maxUsesPerUser: number;
  usageCount?: number;
}

export interface ControlledCoupon extends CouponSetup {
  id: number;
  code: string;
}

type CreateCoupon = (setup: CouponSetup) => Promise<ControlledCoupon>;

interface CouponFixtures {
  createCoupon: CreateCoupon;
}

export const test = authTest.extend<CouponFixtures>({
  createCoupon: async ({ request }, use, testInfo) => {
    const adminSession = await loginThroughApi(
      request,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD,
      'admin',
    );
    let userSession: ApiSession | null = null;
    const createdCouponIds: number[] = [];
    let sequence = 0;

    const createCoupon: CreateCoupon = async (setup) => {
      sequence += 1;
      const code = uniqueCouponCode(
        setup.prefix,
        testInfo.workerIndex,
        testInfo.retry,
        sequence,
      );
      const createResponse = await request.post(`${apiUrl}/api/admin/coupons`, {
        headers: authorizationHeader(adminSession.token),
        data: {
          code,
          type: setup.type,
          discount_value: setup.discountValue,
          min_order_amount: setup.minOrderAmount,
          expired_at: setup.expiredAt,
          max_uses_per_user: setup.maxUsesPerUser,
        },
      });

      if (!createResponse.ok()) {
        throw new Error(`Controlled coupon creation returned ${createResponse.status()}`);
      }

      const body = (await createResponse.json()) as { id?: number };
      if (!Number.isInteger(body.id)) {
        throw new Error('Controlled coupon creation did not return a numeric ID');
      }

      const couponId = body.id as number;
      createdCouponIds.push(couponId);

      if ((setup.usageCount ?? 0) > 0) {
        userSession ??= await loginThroughApi(
          request,
          process.env.USER_EMAIL,
          process.env.USER_PASSWORD,
          'user',
        );

        for (let count = 0; count < (setup.usageCount ?? 0); count += 1) {
          const usageResponse = await request.post(`${apiUrl}/api/coupon-usage`, {
            headers: authorizationHeader(userSession.token),
            data: { coupon_id: couponId },
          });
          if (!usageResponse.ok()) {
            throw new Error(`Coupon usage setup returned ${usageResponse.status()}`);
          }
        }
      }

      return { ...setup, id: couponId, code };
    };

    await use(createCoupon);

    for (const couponId of createdCouponIds.reverse()) {
      const cleanupResponse = await request.delete(`${apiUrl}/api/admin/coupons/${couponId}`, {
        headers: authorizationHeader(adminSession.token),
      });
      if (!cleanupResponse.ok()) {
        throw new Error(`Controlled coupon cleanup returned ${cleanupResponse.status()}`);
      }
    }
  },
});

export { expect };

interface ApiSession {
  token: string;
}

async function loginThroughApi(
  request: APIRequestContext,
  email: string | undefined,
  password: string | undefined,
  expectedRole: 'admin' | 'user',
): Promise<ApiSession> {
  if (!email || !password) {
    throw new Error(`${expectedRole.toUpperCase()} credentials must be provided in HW04/.env`);
  }

  const response = await request.post(`${apiUrl}/api/login`, {
    data: { email, password },
  });
  if (!response.ok()) {
    throw new Error(`${expectedRole} API login returned ${response.status()}`);
  }

  const body = (await response.json()) as { token?: string; user?: { role?: string } };
  if (!body.token || body.user?.role !== expectedRole) {
    throw new Error(`${expectedRole} API login returned an unexpected role or token`);
  }
  return { token: body.token };
}

function authorizationHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

function uniqueCouponCode(
  prefix: string,
  workerIndex: number,
  retry: number,
  sequence: number,
): string {
  const normalizedPrefix = prefix.replace(/[^A-Z0-9]/gi, '').slice(-8).toUpperCase();
  const timeToken = Date.now().toString(36).slice(-7).toUpperCase();
  return `HW4${normalizedPrefix}${workerIndex}${retry}${sequence}${timeToken}`;
}
