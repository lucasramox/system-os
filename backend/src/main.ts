import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // ⚡ expor a pasta uploads como estática
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // ex: http://localhost:3000/uploads/file.png
  })

  // Swagger
  const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger')
  const config = new DocumentBuilder()
    .setTitle('Kodigos api')
    .setDescription('Documentação da API com autenticação JWT')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
