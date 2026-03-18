import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gift } from '../database/entities/gift.entity';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';

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

    async createGift(createGiftDto: CreateGiftDto): Promise<Gift> {
        const gift = this.giftRepository.create({
            ...createGiftDto,
            description: createGiftDto.description ?? null,
            monetaryValue:
                createGiftDto.monetaryValue === undefined
                    ? null
                    : createGiftDto.monetaryValue.toFixed(2),
            isActive: createGiftDto.isActive ?? true,
        });

        return this.giftRepository.save(gift);
    }

    async updateGiftById(id: string, updateGiftDto: UpdateGiftDto): Promise<Gift> {
        const gift = await this.giftRepository.findOne({ where: { id } });
        if (!gift) {
            throw new NotFoundException('Gift not found');
        }

        const updatePayload: Partial<Gift> = {};
        if (updateGiftDto.name !== undefined) {
            updatePayload.name = updateGiftDto.name;
        }
        if (updateGiftDto.description !== undefined) {
            updatePayload.description = updateGiftDto.description;
        }
        if (updateGiftDto.points !== undefined) {
            updatePayload.points = updateGiftDto.points;
        }
        if (updateGiftDto.monetaryValue !== undefined) {
            updatePayload.monetaryValue = updateGiftDto.monetaryValue.toFixed(2);
        }
        if (updateGiftDto.stock !== undefined) {
            updatePayload.stock = updateGiftDto.stock;
        }
        if (updateGiftDto.isActive !== undefined) {
            updatePayload.isActive = updateGiftDto.isActive;
        }

        const mergedGift = this.giftRepository.merge(gift, updatePayload);
        return this.giftRepository.save(mergedGift);
    }

    async deleteGiftById(id: string): Promise<void> {
        const result = await this.giftRepository.delete({ id });
        if (!result.affected) {
            throw new NotFoundException('Gift not found');
        }
    }
}
