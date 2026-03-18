import { UserRole } from '../../database/entities/user-role.enum';

export interface JwtPayload {
    sub: string;
    username: string;
    role: UserRole;
}
