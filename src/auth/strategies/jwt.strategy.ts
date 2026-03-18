import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../database/entities/user-role.enum';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

export interface AuthenticatedUser {
    userId: string;
    username: string;
    role: UserRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET ?? 'change-me-in-production',
        });
    }

    validate(payload: JwtPayload): AuthenticatedUser {
        return {
            userId: payload.sub,
            username: payload.username,
            role: payload.role,
        };
    }
}
