import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as figlet from 'figlet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  figlet('Develop By RAZOR', 
    {
      font: 'Big', 
      horizontalLayout: 'default',
      verticalLayout: 'default',
    },(err, data) => {
    if (err) {
      console.error('Error generando ASCII:', err);
    } else {
      console.log(data);
    }
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
