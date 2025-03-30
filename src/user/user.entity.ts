import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Todo } from '../todo/todo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, todo => todo.assignedTo)
  assignedTodos: Todo[];

  @OneToMany(() => Todo, todo => todo.createdBy)
  createdTodos: Todo[];
} 