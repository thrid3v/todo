import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(todoData: Partial<Todo>, createdBy: User, assignedTo: User): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...todoData,
      createdBy,
      assignedTo,
    });
    return await this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find({
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async findOne(id: number): Promise<Todo> {
    return await this.todoRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async findByUser(userId: number): Promise<Todo[]> {
    return await this.todoRepository.find({
      where: [
        { assignedTo: { id: userId } },
        { createdBy: { id: userId } },
      ],
      relations: ['createdBy', 'assignedTo'],
    });
  }

  async update(id: number, todoData: Partial<Todo>): Promise<Todo> {
    await this.todoRepository.update(id, todoData);
    return await this.findOne(id);
  }

  async toggleComplete(id: number): Promise<Todo> {
    const todo = await this.findOne(id);
    todo.completed = !todo.completed;
    return await this.todoRepository.save(todo);
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
} 