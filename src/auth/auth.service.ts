import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../database/entities/user-role.enum';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async login(
        username: string,
        password: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.validateCredentials(username, password);
        return this.issueToken(user);
    }

    async adminLogin(
        username: string,
        password: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.validateCredentials(username, password);
        if (user.role !== UserRole.ADMIN) {
            throw new UnauthorizedException('Invalid admin credentials');
        }
        return this.issueToken(user);
    }

    private async validateCredentials(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { username },
            select: ['id', 'username', 'password', 'role'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    private issueToken(user: Pick<User, 'id' | 'username' | 'role'>): {
        accessToken: string;
        refreshToken: string;
    } {
        const payload: JwtPayload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }
}
