import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from '../database/entities/gift.entity';

export interface GiftsPaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GiftsPageResult {
    items: Gift[];
    meta: GiftsPaginationMeta;
}

@Injectable()
export class GiftsService {
    constructor(
        @InjectRepository(Gift)
        private readonly giftRepository: Repository<Gift>,
    ) {}

    async getGifts(page: number, limit: number): Promise<GiftsPageResult> {
        const [items, total] = await this.giftRepository.findAndCount({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            items,
            meta: {
                page,
                limit,
                total,
                totalPages: total === 0 ? 0 : Math.ceil(total / limit),
            },
        };
    }
}
