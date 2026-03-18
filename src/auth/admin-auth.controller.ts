import { Post, HttpCode, Body, Controller } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('')
    @HttpCode(200)
    async adminLogin(@Body() loginDto: LoginDto): Promise<{
        statusCode: number;
        message: string;
        data: { accessToken: string; refreshToken: string };
    }> {
        const data = await this.authService.adminLogin(loginDto.username, loginDto.password);

        return {
            statusCode: 200,
            message: 'Login successful',
            data,
        };
    }
}
