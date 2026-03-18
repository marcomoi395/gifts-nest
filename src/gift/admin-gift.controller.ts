import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../database/entities/user-role.enum';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftsService } from './gift.service';
import { GetGiftDto } from './dto/get-gift.dto';

@Controller('admin/gift')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminGiftsController {
    constructor(private readonly giftsService: GiftsService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getGiftsForAdmin(@Query() query: GetGiftDto): Promise<{
        statusCode: number;
        message: string;
        data: Awaited<ReturnType<GiftsService['getGiftsForAdmin']>>;
    }> {
        const { limit = 10, page = 1, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const data = await this.giftsService.getGiftsForAdmin(page, limit, sortBy, sortOrder);

        return {
            statusCode: 200,
            message: 'Fetched gifts successfully',
            data,
        };
    }

    @Post()
    async createGift(@Body() createGiftDto: CreateGiftDto): Promise<{
        statusCode: number;
        message: string;
        data: Awaited<ReturnType<GiftsService['createGift']>>;
    }> {
        const data = await this.giftsService.createGift(createGiftDto);

        return {
            statusCode: 201,
            message: 'Gift created successfully',
            data,
        };
    }

    @Put(':id')
    async updateGift(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateGiftDto: UpdateGiftDto,
    ): Promise<{
        statusCode: number;
        message: string;
        data: Awaited<ReturnType<GiftsService['updateGiftById']>>;
    }> {
        const data = await this.giftsService.updateGiftById(id, updateGiftDto);

        return {
            statusCode: 200,
            message: 'Gift updated successfully',
            data,
        };
    }

    @Delete(':id')
    @HttpCode(200)
    async deleteGift(@Param('id', new ParseUUIDPipe()) id: string): Promise<{
        statusCode: number;
        message: string;
        data: { id: string };
    }> {
        await this.giftsService.deleteGiftById(id);

        return {
            statusCode: 200,
            message: 'Gift deleted successfully',
            data: { id },
        };
    }
}
