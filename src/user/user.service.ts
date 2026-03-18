import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getCurrentUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateUserProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userRepository.findOne({
                where: { email: updateUserDto.email },
            });

            if (existingUser) {
                throw new ConflictException('Email already in use');
            }
        }

        const updatePayload: Partial<User> = {};
        if (updateUserDto.fullName !== undefined) {
            updatePayload.fullName = updateUserDto.fullName;
        }
        if (updateUserDto.email !== undefined) {
            updatePayload.email = updateUserDto.email;
        }
        if (updateUserDto.phoneNumber !== undefined) {
            updatePayload.phoneNumber = updateUserDto.phoneNumber;
        }
        if (updateUserDto.avatarUrl !== undefined) {
            updatePayload.avatarUrl = updateUserDto.avatarUrl;
        }
        if (updateUserDto.bio !== undefined) {
            updatePayload.bio = updateUserDto.bio;
        }

        const mergedUser = this.userRepository.merge(user, updatePayload);
        return this.userRepository.save(mergedUser);
    }
}
