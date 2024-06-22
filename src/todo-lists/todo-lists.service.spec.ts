import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoListsService } from './todo-lists.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';

describe('TodoListsService', () => {
  let service: TodoListsService;

  const mockCacheKeys = jest.fn();
  const mockCacheSet = jest.fn();
  const mockCacheGet = jest.fn();
  const mockCatchDel = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date());
  });

  afterAll(() => {
    jest.useRealTimers();
  });  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoListsService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            store: {
              keys: mockCacheKeys,
            },
            set: mockCacheSet,
            get: mockCacheGet,
            del: mockCatchDel,
          },
        },
      ],
    }).compile();

    service = module.get<TodoListsService>(TodoListsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create todo list', async () => {
      const mockPayload: CreateTodoListDto = {
        content: 'mock_content',
      };
      mockCacheKeys.mockResolvedValueOnce([]);

      const result = await service.create(mockPayload);

      expect(result).toEqual({ id: 1 });
      expect(mockCacheSet).toHaveBeenCalledWith(
        '1',
        {
          id: 1,
          content: 'mock_content',
          completedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        0,
      );
    });
  });

  describe('findAll', () => {
    it('should get all todo lists', async () => {
      const now = new Date();
      const mockResult = [
        {
          id: 1,
          createdAt: now,
        },
        {
          id: 2,
          createdAt: new Date(now.getTime() + 1),
        }
      ]
      mockCacheKeys.mockResolvedValueOnce([1, 2]);
      mockCacheGet
        .mockResolvedValueOnce(mockResult[0])
        .mockResolvedValueOnce(mockResult[1]);

      const result = await service.findAll();

      expect(result).toEqual(mockResult);
    });

    it('should sorting correctly', async () => {
      const now = new Date();
      const mockResult = [
        {
          id: 1,
          completedAt: new Date(now.getTime() + 6),
          createdAt: now,
        },
        {
          id: 2,
          completedAt: null,
          createdAt: new Date(now.getTime() + 2),
        },
        {
          id: 3,
          completedAt: new Date(now.getTime() + 5),
          createdAt: new Date(now.getTime() + 3),
        },
        {
          id: 4,
          completedAt: null,
          createdAt: new Date(now.getTime() + 4),
        }
      ]
      mockCacheKeys.mockResolvedValueOnce([1, 2, 3, 4]);
      mockCacheGet
        .mockResolvedValueOnce(mockResult[0])
        .mockResolvedValueOnce(mockResult[1])
        .mockResolvedValueOnce(mockResult[2])
        .mockResolvedValueOnce(mockResult[3]);

      const result = await service.findAll();

      expect(result).toEqual([
        mockResult[1],
        mockResult[3],
        mockResult[2],
        mockResult[0],
      ]);
    });
  });

  describe('findOne', () => {
    it('should return result if id exists', async () => {
      mockCacheGet.mockResolvedValueOnce({
        id: 1
      });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('should throw error if id not exists', async () => {
      await expect(service.findOne(2)).rejects.toThrow('Not Found')
    });
  });

  describe('update', () => {
    it('should update content if content is given', async () => {
      const now = new Date();
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        id: 1,
        content: 'mock_content',
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.update(1, { content: 'updated' });

      expect(result).toEqual({ id: 1 });
      expect(mockCacheSet).toHaveBeenCalledWith(
        '1',
        {
          id: 1,
          content: 'updated',
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        0,
      );
    });

    it('should update completedAt if completed is true', async () => {
      const now = new Date();
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        id: 1,
        content: 'mock_content',
        completedAt: null,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.update(1, { completed: true });

      expect(result).toEqual({ id: 1 });
      expect(mockCacheSet).toHaveBeenCalledWith(
        '1',
        {
          id: 1,
          content: 'mock_content',
          completedAt: now,
          createdAt: now,
          updatedAt: now,
        },
        0,
      );
    });

    it('should update completedAt to null if completed is false', async () => {
      const now = new Date();
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        id: 1,
        content: 'mock_content',
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.update(1, { completed: false });

      expect(result).toEqual({ id: 1 });
      expect(mockCacheSet).toHaveBeenCalledWith(
        '1',
        {
          id: 1,
          content: 'mock_content',
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        },
        0,
      );
    });
  });

  describe('remove', () => {
    it('should remove todo list', async () => {
      const now = new Date();
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        id: 1,
        content: 'mock_content',
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.remove(1);
      
      expect(result).toEqual({ id: 1 });
      expect(mockCatchDel).toHaveBeenCalledWith('1');
    });
  });
});
