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
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    private async ensureUserExists(usernameOrEmail: string) {
        const user = await this.usersService.findOne(usernameOrEmail);
        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        if (!createUserDto.displayname || createUserDto.displayname === '') {
            createUserDto.displayname = createUserDto.username;
        }

        await this.usersService.create(createUserDto);

        return { message: 'User created successfully.' };
    }

    @Get()
    async findAll() {
        const users = await this.usersService.findAll();

        if (!users) {
            throw new HttpException(
                'There are no users.',
                HttpStatus.NOT_FOUND,
            );
        }

        return users.map(
            ({
                uuid,
                username,
                email,
                displayname,
                bio,
                createdAt,
                updatedAt,
            }) => ({
                uuid,
                username,
                email,
                displayname,
                bio,
                createdAt,
                updatedAt,
            }),
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async findOne(@Param('username') username: string) {
        const user = await this.usersService.findOne(username);

        if (!user) {
            throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
        }

        return {
            uuid: user.uuid,
            displayname: user.displayname,
            bio: user.bio,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':username')
    async update(
        @Param('username') username: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.ensureUserExists(username);
        await this.usersService.update(username, updateUserDto);
        return { message: 'User updated successfully.' };
    }

    @Delete(':username')
    async remove(@Param('username') username: string) {
        await this.ensureUserExists(username);
        await this.usersService.remove(username);
        return { message: 'User deleted successfully.' };
    }
}
