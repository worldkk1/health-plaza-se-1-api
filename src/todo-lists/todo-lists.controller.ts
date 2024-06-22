import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

@Controller('todo')
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Post()
  create(@Body() createTodoListDto: CreateTodoListDto) {
    return this.todoListsService.create(createTodoListDto);
  }

  @Get()
  findAll() {
    return this.todoListsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoListsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoListDto: UpdateTodoListDto) {
    return this.todoListsService.update(+id, updateTodoListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoListsService.remove(+id);
  }
}
