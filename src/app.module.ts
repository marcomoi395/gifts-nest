import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from './database/typeorm.config';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmOptions), AuthModule, GiftsModule, UsersModule],
})
export class AppModule {}
