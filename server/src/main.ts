import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'verbose', 'warn'],
  });

  const config = app.get(ConfigService);

  const port = config.get<number>('API_PORT') || 4201;
  app.enableCors();
  await app.listen(port, () =>
    console.log('\x1b[33m%s\x1b[0m', `Server started on port ${port}`),
  );
}
bootstrap();
