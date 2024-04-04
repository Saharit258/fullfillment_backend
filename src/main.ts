import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Fullfillmant')
    .setDescription(
      'คลังสินค้าทั่วไปมักใช้สำหรับจัดเก็บสินค้าหลากหลายชนิดที่ไม่ต้องการการดูแลรักษาเป็นพิเศษ เหมาะสำหรับผู้ผลิตหรือผู้ประกอบในอุตสาหกรรมสินค้าเพื่อการอุปโภค สินค้าสำเร็จรูป ข้าวของเครื่องใช้ทั่วไป ชิ้นส่วนต่าง ๆ',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(morgan('short'));

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
