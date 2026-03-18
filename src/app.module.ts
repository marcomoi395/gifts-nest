import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftsModule } from './gift/gift.module';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { typeOrmOptions } from './database/typeorm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(typeOrmOptions),
        AuthModule,
        GiftsModule,
        UsersModule,
    ],
})
export class AppModule {}
