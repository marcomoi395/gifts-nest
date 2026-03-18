import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString, IsIn } from 'class-validator';

export class GetGiftDto {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @IsString()
    @IsIn(['createdAt', 'name', 'points', 'stock', 'monetaryValue'])
    sortBy?: 'createdAt' | 'name' | 'points' | 'stock' | 'monetaryValue';

    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}
