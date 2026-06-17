import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { config } from '../config.js';

const jwks = config.propelAuthUrl
  ? createRemoteJWKSet(new URL(`${config.propelAuthUrl.replace(/\/$/, '')}/.well-known/jwks.json`))
  : null;

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (config.authMode === 'development') {
      const id = String(req.header('x-user-id') ?? 'demo-traveler');
      req.user = { id, email: `${id}@example.com` };
      return next();
    }

    const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token || !jwks || !config.propelAuthUrl) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const verified = await jwtVerify(token, jwks, {
      issuer: config.propelAuthUrl,
      audience: config.propelAudience || undefined
    });
    req.user = {
      id: String(verified.payload.sub),
      email: typeof verified.payload.email === 'string' ? verified.payload.email : undefined
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
}

export function requirePublicApiKey(req: Request, res: Response, next: NextFunction) {
  if (req.header('x-api-key') !== config.publicApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  return next();
}
