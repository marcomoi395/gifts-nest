import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto): Promise<{
        statusCode: number;
        message: string;
        data: { accessToken: string; refreshToken: string };
    }> {
        const data = await this.authService.login(loginDto.username, loginDto.password);

        return {
            statusCode: 200,
            message: 'Login successful',
            data,
        };
    }

    @Post('admin-login')
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
