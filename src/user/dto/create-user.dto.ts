import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'The email cannot be empty.' })
    @IsString({ message: 'The email must be of string type.' })
    @IsEmail({}, { message: 'Invalid email.' })
    @Length(5, 255, {
        message: 'The email must be between 5 and 255 characters.',
    })
    email: string;

    @IsNotEmpty({ message: 'The username cannot be empty.' })
    @IsString({ message: 'The username must be of string type.' })
    @Length(5, 36, {
        message: 'The username must be between 5 and 36 characters.',
    })
    username: string;

    @IsString({ message: 'The display name must be of string type.' })
    @Length(5, 36, {
        message: 'The display name must be between 5 and 36 characters.',
    })
    @IsOptional()
    displayName: string | null;

    @IsString({ message: 'The bio must be of string type.' })
    @Length(1, 500, {
        message: 'The bio must be between 1 and 500 characters.',
    })
    @IsOptional()
    bio: string | null;

    @IsNotEmpty({ message: 'The password cannot be empty.' })
    @IsString({ message: 'The password must be of string type.' })
    password: string;
}
