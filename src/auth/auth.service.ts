import {
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user = await this.userService.findOne(username);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password,
            );

            if (user && isPasswordValid) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            Logger.error(error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async login(user: any) {
        try {
            const payload = { username: user.username, sub: user.uuid };
            return {
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Unable to login');
        }
    }
}
