import { loadProjectEnv } from './src/common/config/load-project-env';
import { defineConfig, env } from 'prisma/config';

loadProjectEnv();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
