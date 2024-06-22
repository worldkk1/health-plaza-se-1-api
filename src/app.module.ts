import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoListsModule } from './todo-lists/todo-lists.module';

@Module({
  imports: [CacheModule.register({ isGlobal: true }), TodoListsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
