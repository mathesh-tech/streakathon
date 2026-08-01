import crypto from 'crypto';

export function generateVerificationToken(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
  const expires = Date.now() + 30 * 60 * 1000; // 30 minutes
  const payload = `${email}:${expires}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifyEmailToken(token: string): { email: string, valid: boolean } {
  try {
    const secret = process.env.NEXTAUTH_SECRET || 'fallback-secret';
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [email, expiresStr, signature] = decoded.split(':');
    const expires = parseInt(expiresStr, 10);
    
    if (Date.now() > expires) return { email, valid: false };

    const payload = `${email}:${expires}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { email, valid: true };
    }
    
    return { email, valid: false };
  } catch (err) {
    return { email: '', valid: false };
  }
}
