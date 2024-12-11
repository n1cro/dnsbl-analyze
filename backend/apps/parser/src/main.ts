import { NestFactory } from '@nestjs/core';
import { ParserModule } from './parser.module';

async function bootstrap() {
	const app = await NestFactory.create(ParserModule); // TODO: try to exclude express
	await app.init();
}
bootstrap();

// lazyload{% if forloop.first %} lazypreload{% endif %}"
