import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthTokenResponseDto {
    @Expose()
    accessToken: string;

    @Expose()
    refreshToken: string;

    constructor(partial: Partial<AuthTokenResponseDto>) {
        Object.assign(this, partial);
    }

    static create(tokens: { accessToken: string; refreshToken: string }): AuthTokenResponseDto {
        return new AuthTokenResponseDto(tokens);
    }
}
