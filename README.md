REST API for TODO list using in-memory cache

1. Add todo
```
path: /todo
method: POST
payload: {
  content: string;
}
```

2. Get all todo list
```
path: /todo
method: GET
```

3. Get specific todo
```
path: /todo/:todoId
method: GET
```

4. Update todo
```
path: /todo/:todoId
method: PATCH
payload: {
  content?: string;
  completed?: boolean;
}
```

5. Delete todo
```
path: /todo/:todoId
method: DELETE
```
