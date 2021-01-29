import { ConnectionOptions } from 'typeorm';
import { rmSync } from 'fs';
import { join } from 'path';

const employeeEntitySchema = {
  tableName: 'Employees',
  name: 'Employee',
  columns: {
    id: { type: 'integer', generated: true, primary: true },
    name: { type: 'text', nullable: false },
    age: { type: 'integer', nullable: false }
  }
};

export const createDbConfig = (dbName?: string): ConnectionOptions => ({
  name: dbName || 'default',
  type: 'better-sqlite3',
  database: dbName ? `${dbName}.db` : ':memory:',
  synchronize: true,
  entities: [
    // @ts-ignore
    employeeEntitySchema
  ]
});

export const removeTestFiles = (dbName: string): void => {
  const files = [`${dbName}.db`, `${dbName}.db-shm`, `${dbName}.db-wal`];
  files.forEach(f => {
    const path = join(__dirname, `../${f}`);
    return rmSync(path, { maxRetries: 3, retryDelay: 1000, force: true });
  });
};
