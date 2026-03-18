import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftsService } from './gift.service';
import { GiftsController } from './gift.controller';
import { Gift } from '../database/entities/gift.entity';
import { AdminGiftsController } from './admin-gift.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([Gift]), AuthModule],
    controllers: [GiftsController, AdminGiftsController],
    providers: [GiftsService],
})
export class GiftsModule {}
