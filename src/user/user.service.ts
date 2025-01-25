import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly db: PrismaService) {}

    async checkUniqueUser(email: string, username: string) {
        try {
            const user = await this.db.user.findMany({
                where: {
                    OR: [{ email }, { username }],
                },
            });

            return user.length === 0;
        } catch (error) {
            return error;
        }
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const [user] = await this.db.$transaction([
                this.db.user.create({
                    data: {
                        ...createUserDto,
                        password: await bcrypt.hash(createUserDto.password, 10),
                    },
                }),
            ]);

            return user;
        } catch (error) {
            return error;
        }
    }

    async findAll(): Promise<any[]> {
        try {
            return this.db.user.findMany();
        } catch (error) {
            return error;
        }
    }

    async findOne(username: string) {
        try {
            return this.db.user.findUnique({
                where: {
                    username,
                },
            });
        } catch (error) {
            return error;
        }
    }

    async update(username: string, updateUserDto: UpdateUserDto) {
        try {
            const [user] = await this.db.$transaction([
                this.db.user.update({
                    where: {
                        username,
                    },
                    data: {
                        ...updateUserDto,
                    },
                }),
            ]);

            return user;
        } catch (error) {
            return error;
        }
    }

    async remove(username: string) {
        try {
            return this.db.user.delete({
                where: {
                    username,
                },
            });
        } catch (error) {
            return error;
        }
    }
}
