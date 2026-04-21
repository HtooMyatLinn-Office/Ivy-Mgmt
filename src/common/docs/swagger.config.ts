import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Adam POS - Inventory API')
    .setDescription('Warehouse management module for POS')
    .setVersion('1.0.0')
    .addTag('Inventory')
    .addApiKey(
      { type: 'apiKey', name: 'x-user-id', in: 'header', description: 'Actor identity for audit trail' },
      'x-user-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
}
