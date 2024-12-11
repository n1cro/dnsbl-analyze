import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';

async function bootstrap() {
	const app = await NestFactory.create(ApiModule);
	app.setGlobalPrefix(`${process.env.API_PREFIX}`);
	await app.listen(+process.env.API_PORT || 3000);
}
bootstrap();
