import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const checkUser = await this.usersService.checkUniqueUser(
                createUserDto.email,
                createUserDto.username,
            );

            if (!checkUser) {
                throw new HttpException(
                    'User already exists.',
                    HttpStatus.CONFLICT,
                );
            }

            if (
                !createUserDto.displayname ||
                createUserDto.displayname === ''
            ) {
                createUserDto.displayname = createUserDto.username;
            }

            const user = await this.usersService.create(createUserDto);

            const response = {
                uuid: user.uuid,
                username: user.username,
                displayname: user.displayname,
                bio: user.bio,
                email: user.email,
                createdAt: user.createdAt,
            };

            return res.status(HttpStatus.CREATED).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    @Get()
    async findAll(@Res() res: Response) {
        try {
            const users = await this.usersService.findAll();

            const response = users.map((user) => {
                return {
                    uuid: user.uuid,
                    username: user.username,
                    email: user.email,
                    displayname: user.displayname,
                    bio: user.bio,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
            });

            return res.status(HttpStatus.OK).json(response);
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    @Get(':username')
    async findOne(@Param('username') username: string, @Res() res: Response) {
        try {
            const user = await this.usersService.findOne(username);
            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            return res.status(HttpStatus.OK).json({
                uuid: user.uuid,
                username: user.username,
                email: user.email,
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    @Patch(':username')
    async update(
        @Param('username') username: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() res: Response,
    ) {
        try {
            const user = await this.usersService.findOne(username);
            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            await this.usersService.update(username, updateUserDto);
            return res.status(HttpStatus.OK).json('User updated successfully.');
        } catch (error) {
            return res.status(HttpStatus.CONFLICT).json(error);
        }
    }

    @Patch('/updatePassword')
    async updatePassword(
        @Body() updatePasswordDto: UpdatePasswordDto,
        @Res() res: Response,
    ) {
        try {
            const user = await this.usersService.findOne(
                updatePasswordDto.email,
            );

            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            await this.usersService.updatePassword(
                updatePasswordDto.email,
                updatePasswordDto.password,
                updatePasswordDto.newPassword,
            );

            return res
                .status(HttpStatus.NO_CONTENT)
                .json('Password updated successfully.');
        } catch (error) {
            return res.status(HttpStatus.CONFLICT).json(error);
        }
    }

    @Delete(':username')
    async remove(@Param('username') username: string, @Res() res: Response) {
        try {
            const user = await this.usersService.findOne(username);
            if (!user) {
                throw new HttpException(
                    'User not found.',
                    HttpStatus.NOT_FOUND,
                );
            }

            await this.usersService.remove(username);
            return res.status(HttpStatus.OK).json('User deleted successfully.');
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
    }
}
