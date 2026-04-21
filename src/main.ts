import { loadProjectEnv } from './common/config/load-project-env';

loadProjectEnv();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/docs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableShutdownHooks();
  app.useLogger(new Logger());

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix('api');

  // optional (recommended control)
  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

void bootstrap();