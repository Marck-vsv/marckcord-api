import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [UserModule, DatabaseModule, AuthModule],
    controllers: [],
    providers: [],
    exports: [DatabaseModule],
})
export class AppModule {}
