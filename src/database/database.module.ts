import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global()
@Module({
    controllers: [],
    providers: [DatabaseService],
})
export class DatabaseModule {}
