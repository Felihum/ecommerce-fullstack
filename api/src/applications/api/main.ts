import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from '@infrastructure/http/application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new ApplicationExceptionFilter()
  );

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
