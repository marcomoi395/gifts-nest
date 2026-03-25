import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto): Promise<ApiResponseDto<AuthTokenResponseDto>> {
        const tokens = await this.authService.login(loginDto.username, loginDto.password);

        return {
            statusCode: 200,
            message: 'Login successful',
            data: AuthTokenResponseDto.create(tokens),
        };
    }
}
