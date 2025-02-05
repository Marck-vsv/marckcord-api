import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
    @IsString({ message: 'The username must be of string type.' })
    @IsEmail({}, { message: 'Invalid email.' })
    @IsNotEmpty({ message: 'The username cannot be empty.' })
    @Length(5, 255, {
        message: 'The email must have between 5 and 255 characters.',
    })
    email: string;

    @IsString({ message: 'The password must be of string type.' })
    @IsNotEmpty({ message: 'The password cannot be empty.' })
    password: string;

    @IsString({ message: 'The new password must be of string type.' })
    @IsNotEmpty({ message: 'You must provide a new password.' })
    newPassword: string;
}
