import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
  saltRounds: Number(process.env.SALT_ROUNDS),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
  siteDomain: process.env.SITE_DOMAIN as string
};