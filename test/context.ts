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

export const testDatabaseNames = ['db1', 'db2', 'db3', 'db4'];

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

export const removeTestFiles = (): void => {
  testDatabaseNames.forEach(name => {
    const files = [`${name}.db`, `${name}.db-shm`, `${name}.db-wal`];
    files.forEach(f => rmSync(join(__dirname, `../${f}`), { force: true }));
  });
};
