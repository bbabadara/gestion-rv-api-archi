import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { AppDataSource } from '../config/database';
import { IBaseRepository } from './interfaces/IBaseRepository';

export abstract class BaseRepository<T extends ObjectLiteral> implements IBaseRepository<T> {
  protected repository: Repository<T>;

  constructor(entityClass: any) {
    this.repository = AppDataSource.getRepository<T>(entityClass);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOneBy({ id: id as any } as any);
  }

  async create(entity: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(entity);
    return this.repository.save(newEntity);
  }

  async update(id: string, entity: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, entity as any);
    return this.findById(id) as Promise<T>;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }
}