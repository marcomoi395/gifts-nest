import { IsOptional, IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    fullName?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(120)
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    bio?: string;
}
