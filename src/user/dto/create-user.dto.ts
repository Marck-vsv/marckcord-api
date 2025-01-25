import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'The email cannot be empty.' })
    @IsString({ message: 'The email must be of string type.' })
    @IsEmail({}, { message: 'Invalid email.' })
    email: string;

    @IsNotEmpty({ message: 'The username cannot be empty.' })
    @IsString({ message: 'The username must be of string type.' })
    username: string;

    @IsNotEmpty({ message: 'The password cannot be empty.' })
    @IsString({ message: 'The password must be of string type.' })
    password: string;
}
