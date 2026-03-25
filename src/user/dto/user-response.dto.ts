import { UserRole } from '../../database/entities/user-role.enum';
import { User } from '../../database/entities/user.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
    @Expose()
    id: string;
    @Expose()
    username: string;
    @Expose()
    role: UserRole;
    @Expose()
    fullName: string | null;
    @Expose()
    email: string | null;
    @Expose()
    phoneNumber: string | null;
    @Expose()
    avatarUrl: string | null;
    @Expose()
    bio: string | null;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }

    static fromEntity(user: User): UserResponseDto {
        return new UserResponseDto({
            id: user.id,
            username: user.username,
            role: user.role,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}
