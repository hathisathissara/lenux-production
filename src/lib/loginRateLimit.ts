import { LoginAttempt } from '@/models/LoginAttempt';

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MINUTES = 15;
export const LOCKOUT_DURATION_MS = LOCKOUT_DURATION_MINUTES * 60 * 1000;

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

export function getRateLimitKey(ip: string, email: string): string {
  return `${ip.toLowerCase()}_${email.trim().toLowerCase()}`;
}

export async function checkRateLimit(key: string): Promise<{
  isLocked: boolean;
  remainingMinutes?: number;
  remainingSeconds?: number;
  remainingAttempts?: number;
  lockUntil?: Date | null;
}> {
  const record = await LoginAttempt.findOne({ key });

  if (!record) {
    return {
      isLocked: false,
      remainingAttempts: MAX_LOGIN_ATTEMPTS,
    };
  }

  const now = Date.now();
  if (record.lockUntil && record.lockUntil.getTime() > now) {
    const remainingMs = record.lockUntil.getTime() - now;
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

    return {
      isLocked: true,
      remainingMinutes,
      remainingSeconds,
      lockUntil: record.lockUntil,
      remainingAttempts: 0,
    };
  }

  // If lock period has expired, reset attempts
  if (record.lockUntil && record.lockUntil.getTime() <= now) {
    await LoginAttempt.deleteOne({ key });
    return {
      isLocked: false,
      remainingAttempts: MAX_LOGIN_ATTEMPTS,
    };
  }

  const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - (record.attempts || 0));

  return {
    isLocked: false,
    remainingAttempts,
  };
}

export async function recordFailedAttempt(
  key: string,
  email: string,
  ip: string
): Promise<{
  isLocked: boolean;
  remainingAttempts: number;
  remainingMinutes: number;
  remainingSeconds: number;
  lockUntil: Date | null;
}> {
  const now = new Date();
  let record = await LoginAttempt.findOne({ key });

  if (!record) {
    record = new LoginAttempt({
      key,
      email: email.trim().toLowerCase(),
      ip,
      attempts: 1,
      lockUntil: null,
      expiresAt: new Date(now.getTime() + LOCKOUT_DURATION_MS),
    });
  } else {
    // If previous lockout expired, restart count
    if (record.lockUntil && record.lockUntil.getTime() <= now.getTime()) {
      record.attempts = 1;
      record.lockUntil = null;
    } else {
      record.attempts += 1;
    }

    if (record.attempts >= MAX_LOGIN_ATTEMPTS) {
      record.lockUntil = new Date(now.getTime() + LOCKOUT_DURATION_MS);
      record.expiresAt = new Date(now.getTime() + LOCKOUT_DURATION_MS + 60 * 1000);
    } else {
      record.expiresAt = new Date(now.getTime() + LOCKOUT_DURATION_MS);
    }
  }

  await record.save();

  if (record.lockUntil && record.lockUntil.getTime() > now.getTime()) {
    const remainingMs = record.lockUntil.getTime() - now.getTime();
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

    return {
      isLocked: true,
      remainingAttempts: 0,
      remainingMinutes,
      remainingSeconds,
      lockUntil: record.lockUntil,
    };
  }

  const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - record.attempts);

  return {
    isLocked: false,
    remainingAttempts,
    remainingMinutes: 0,
    remainingSeconds: 0,
    lockUntil: null,
  };
}

export async function resetRateLimit(key: string): Promise<void> {
  await LoginAttempt.deleteOne({ key });
}
