import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GiftsService } from './gift.service';
import { getGiftDto } from './dto/get-gift.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('gift')
export class GiftsController {
    constructor(private readonly giftsService: GiftsService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getSystemGifts(@Query() query: getGiftDto): Promise<{
        statusCode: number;
        message: string;
        data: Awaited<ReturnType<GiftsService['getGifts']>>;
    }> {
        const { limit = 10, page = 1 } = query;
        const data = await this.giftsService.getGifts(page, limit);

        return {
            statusCode: 200,
            message: 'Fetched gifts successfully',
            data,
        };
    }
}
