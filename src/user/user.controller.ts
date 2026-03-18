import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { User } from '../database/entities/user.entity';
import { UsersService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async me(@Req() req: Request & { user: AuthenticatedUser }): Promise<{
        statusCode: number;
        message: string;
        data: User;
    }> {
        const data = await this.usersService.getCurrentUser(req.user.userId);

        return {
            statusCode: 200,
            message: 'Fetched user profile successfully',
            data,
        };
    }

    @Put('me')
    @UseGuards(AuthGuard('jwt'))
    async updateProfile(
        @Req() req: Request & { user: AuthenticatedUser },
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<{
        statusCode: number;
        message: string;
        data: User;
    }> {
        const data = await this.usersService.updateUserProfile(req.user.userId, updateUserDto);

        return {
            statusCode: 200,
            message: 'User profile updated successfully',
            data,
        };
    }
}
