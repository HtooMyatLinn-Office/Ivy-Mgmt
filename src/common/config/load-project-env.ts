import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * Loads `.env` from project root first, then `src/.env` if DATABASE_URL is still unset.
 */
export function loadProjectEnv(): void {
  config({ path: resolve(process.cwd(), '.env') });
  if (!process.env.DATABASE_URL) {
    config({ path: resolve(process.cwd(), 'src', '.env') });
  }
}
