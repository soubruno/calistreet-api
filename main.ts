import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true, 
    whitelist: true, 
  }));

  const config = new DocumentBuilder()
    .setTitle('Calistreet API')
    .setDescription('API de Calistenia')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  await app.listen(3000);
  console.log("API Calistreet rodando na porta 3000. Docs em: http://localhost:3000/api/docs");
}
bootstrap();