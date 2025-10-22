import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },

      exceptionFactory: (errors) => {
        const messages = errors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        });

        return new BadRequestException(messages);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
