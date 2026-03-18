import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { User } from '../database/entities/user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: Request & { user: AuthenticatedUser }): Promise<User> {
        return this.usersService.getCurrentUser(req.user.userId);
    }
}
