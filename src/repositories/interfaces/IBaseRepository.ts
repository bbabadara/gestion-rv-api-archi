import { DeepPartial } from "typeorm";

export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: DeepPartial<T>): Promise<T>;
    update(id: string, entity: DeepPartial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    save(entity: T): Promise<T>;
}