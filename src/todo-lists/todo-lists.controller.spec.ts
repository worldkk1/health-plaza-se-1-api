import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsController } from './todo-lists.controller';
import { TodoListsService } from './todo-lists.service';

describe('TodoListsController', () => {
  let controller: TodoListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoListsController],
      providers: [
        TodoListsService,
        { provide: CACHE_MANAGER, useValue: {}},
      ],
    }).compile();

    controller = module.get<TodoListsController>(TodoListsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return CreateTodoListDto', async () => {
      jest.spyOn(controller, 'create').mockResolvedValueOnce({ id: 1 });

      const result = await controller.create({ content: 'mock_content' });

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return TodoList[]', async () => {
      const mockResult = {
        id: 1,
        content: 'content',
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      jest.spyOn(controller, 'findAll').mockResolvedValueOnce([mockResult]);

      const result = await controller.findAll();

      expect(result).toEqual([mockResult]);
    });
  });

  describe('findOne', () => {
    it('should return TodoList', async () => {
      const mockResult = {
        id: 1,
        content: 'content',
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      jest.spyOn(controller, 'findOne').mockResolvedValueOnce(mockResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should return CreateTodoListDto', async () => {
      jest.spyOn(controller, 'update').mockResolvedValueOnce({ id: 1 });

      const result = await controller.update('1', { content: 'updated_content' });

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should return CreateTodoListDto', async () => {
      jest.spyOn(controller, 'remove').mockResolvedValueOnce({ id: 1 });

      const result = await controller.remove('1');

      expect(result).toEqual({ id: 1 });
    });
  });
});
