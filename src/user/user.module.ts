import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../database/entities/user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
