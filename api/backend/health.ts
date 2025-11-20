import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    status: 'ok',
    service: 'as400-backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}




