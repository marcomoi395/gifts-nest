import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GiftsService } from './gift.service';
import { GetGiftDto } from './dto/get-gift.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { GiftPageResponseDto, GiftResponseDto } from './dto/gift-response.dto';

@Controller('gift')
export class GiftsController {
    constructor(private readonly giftsService: GiftsService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getSystemGifts(@Query() query: GetGiftDto): Promise<ApiResponseDto<GiftPageResponseDto>> {
        const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const data = await this.giftsService.getGifts(page, limit, sortBy, sortOrder);

        return {
            statusCode: 200,
            message: 'Fetched gifts successfully',
            data: GiftPageResponseDto.create(
                data.items.map((gift) => GiftResponseDto.fromEntity(gift)),
                data.meta,
            ),
        };
    }
}
