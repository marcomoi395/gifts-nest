import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateGiftDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    points: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    @Min(0)
    monetaryValue?: number;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stock: number;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean;
}
