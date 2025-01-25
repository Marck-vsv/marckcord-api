import { Module } from '@nestjs/common';
import { UsersModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [UsersModule, DatabaseModule],
    controllers: [],
    providers: [],
    exports: [DatabaseModule],
})
export class AppModule {}
