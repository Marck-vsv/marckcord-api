import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
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
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAll(): Promise<any[]> {
        try {
            return this.db.user.findMany();
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findOne(identifier: string) {
        try {
            return this.db.user.findFirst({
                where: {
                    OR: [{ username: identifier }, { email: identifier }],
                },
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    //     const { email, password, newPassword } = updatePasswordDto;

    //     try {
    //         const user = await this.db.user.findFirst({
    //             where: {
    //                 email,
    //             },
    //         });
    //         if (!user) {
    //             throw new HttpException(
    //                 'User not found.',
    //                 HttpStatus.NOT_FOUND,
    //             );
    //         }

    //         const isPasswordValid = await bcrypt.compare(
    //             password,
    //             user.password,
    //         );

    //         if (!isPasswordValid) {
    //             throw new HttpException(
    //                 'Invalid password.',
    //                 HttpStatus.UNAUTHORIZED,
    //             );
    //         }

    //         const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    //         await this.db.user.update({
    //             where: {
    //                 email,
    //             },
    //             data: {
    //                 password: hashedNewPassword,
    //             },
    //         });
    //     } catch (error) {
    //         throw new HttpException(
    //             error.message,
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //         );
    //     }
    // }

    async remove(username: string) {
        try {
            const user = await this.db.user.findUnique({
                where: {
                    username,
                },
            });

            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.db.user.delete({
                where: {
                    username,
                },
            });
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
