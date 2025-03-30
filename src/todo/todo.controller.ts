import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';
import { UserService } from '../user/user.service';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() todoData: { title: string; description?: string; assignedToId: number; createdById: number },
  ): Promise<Todo> {
    const assignedTo = await this.userService.findOne(todoData.assignedToId);
    const createdBy = await this.userService.findOne(todoData.createdById);
    return this.todoService.create(todoData, createdBy, assignedTo);
  }

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Promise<Todo[]> {
    return this.todoService.findByUser(+userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() todoData: Partial<Todo>): Promise<Todo> {
    return this.todoService.update(+id, todoData);
  }

  @Put(':id/toggle')
  toggleComplete(@Param('id') id: string): Promise<Todo> {
    return this.todoService.toggleComplete(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.todoService.remove(+id);
  }
} 