import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from './database/typeorm.config';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmOptions), AuthModule, GiftsModule, UsersModule],
})
export class AppModule {}
