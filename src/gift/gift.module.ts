import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftsService } from './gift.service';
import { GiftsController } from './gift.controller';
import { Gift } from '../database/entities/gift.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Gift])],
    controllers: [GiftsController],
    providers: [GiftsService],
})
export class GiftsModule {}
