import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, JwtStrategy],
})
export class UserModule {}
