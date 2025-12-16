import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
  saltRounds: Number(process.env.SALT_ROUNDS),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN as string
};