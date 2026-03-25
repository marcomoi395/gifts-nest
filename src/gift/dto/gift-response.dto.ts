import { Gift } from '../../database/entities/gift.entity';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GiftResponseDto {
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Expose()
    description: string | null;
    @Expose()
    points: number;
    @Expose()
    monetaryValue: string | null;
    @Expose()
    stock: number;
    @Expose()
    isActive: boolean;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<GiftResponseDto>) {
        Object.assign(this, partial);
    }

    static fromEntity(gift: Gift): GiftResponseDto {
        return new GiftResponseDto({
            id: gift.id,
            name: gift.name,
            description: gift.description,
            points: gift.points,
            monetaryValue: gift.monetaryValue,
            stock: gift.stock,
            isActive: gift.isActive,
            createdAt: gift.createdAt,
            updatedAt: gift.updatedAt,
        });
    }
}

@Exclude()
export class GiftPaginationMetaResponseDto {
    @Expose()
    page: number;
    @Expose()
    limit: number;
    @Expose()
    total: number;
    @Expose()
    totalPages: number;

    constructor(partial: Partial<GiftPaginationMetaResponseDto>) {
        Object.assign(this, partial);
    }

    static fromMeta(meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }): GiftPaginationMetaResponseDto {
        return new GiftPaginationMetaResponseDto(meta);
    }
}

@Exclude()
export class GiftPageResponseDto {
    @Expose()
    @Type(() => GiftResponseDto)
    items: GiftResponseDto[];

    @Expose()
    @Type(() => GiftPaginationMetaResponseDto)
    meta: GiftPaginationMetaResponseDto;

    constructor(partial: Partial<GiftPageResponseDto>) {
        Object.assign(this, partial);
    }

    static create(
        items: GiftResponseDto[],
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        },
    ): GiftPageResponseDto {
        return new GiftPageResponseDto({
            items,
            meta: GiftPaginationMetaResponseDto.fromMeta(meta),
        });
    }
}
