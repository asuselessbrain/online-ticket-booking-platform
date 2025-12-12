import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  dbUrl: process.env.DB_URL,
  port: process.env.PORT,
};