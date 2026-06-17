import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/wandermate',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5174',
  authMode: process.env.AUTH_MODE ?? 'development',
  propelAuthUrl: process.env.PROPELAUTH_AUTH_URL ?? '',
  propelAudience: process.env.PROPELAUTH_AUDIENCE ?? '',
  publicApiKey: process.env.PUBLIC_API_KEY ?? 'wandermate-demo-key'
};
