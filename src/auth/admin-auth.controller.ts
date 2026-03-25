import { Post, HttpCode, Body, Controller } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthTokenResponseDto } from './dto/auth-token-response.dto';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('')
    @HttpCode(200)
    async adminLogin(@Body() loginDto: LoginDto): Promise<ApiResponseDto<AuthTokenResponseDto>> {
        const tokens = await this.authService.adminLogin(loginDto.username, loginDto.password);

        return {
            statusCode: 200,
            message: 'Login successful',
            data: AuthTokenResponseDto.create(tokens),
        };
    }
}
