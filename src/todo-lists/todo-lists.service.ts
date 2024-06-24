import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { TodoList } from './entities/todo-list.entity';
import { CreateTodoResponse } from './interfaces';

@Injectable()
export class TodoListsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(createTodoListDto: CreateTodoListDto): Promise<CreateTodoResponse> {
    const { content } = createTodoListDto;
    const keys = await this.cacheManager.store.keys();
    const id = keys.length + 1;

    const todo = new TodoList();
    todo.id = id;
    todo.content = content;
    todo.completedAt = null;
    todo.createdAt = new Date();
    todo.updatedAt = new Date();
    await this.cacheManager.set(id.toString(), todo, 0);

    return { id };
  }

  async findAll(): Promise<TodoList[]> {
    const keys = await this.cacheManager.store.keys();
    const todoPromises = keys.map(key => this.cacheManager.get<TodoList>(key));
    const todoLists = await Promise.all(todoPromises);
    const incompleteLists: TodoList[] = []
    const completedLists: TodoList[] = [];
    todoLists.forEach(list => {
      if (list.completedAt) {
        completedLists.push(list);
      } else {
        incompleteLists.push(list);
      }
    });
    incompleteLists.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    completedLists.sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
    const sortedLists = [...incompleteLists, ...completedLists];

    return sortedLists;
  }

  async findOne(id: number): Promise<TodoList> {
    const todo = await this.cacheManager.get<TodoList>(id.toString());
    if (!todo) {
      throw new NotFoundException();
    }

    return todo;
  }

  async update(id: number, updateTodoListDto: UpdateTodoListDto): Promise<CreateTodoResponse> {
    const todo = await this.findOne(id);
    const updateTodo: TodoList = {
      ...todo,
      ...updateTodoListDto,
      updatedAt: new Date(),
    }
    if (typeof updateTodoListDto.completed !== 'undefined') {
      const { completed } = updateTodoListDto;
      delete updateTodo['completed'];
      updateTodo.completedAt = completed ? new Date() : null;
    }
    await this.cacheManager.set(id.toString(), updateTodo, 0);

    return { id: todo.id };
  }

  async remove(id: number): Promise<CreateTodoResponse> {
    const todo = await this.findOne(id);
    await this.cacheManager.del(todo.id.toString());

    return { id: todo.id };
  }
}
