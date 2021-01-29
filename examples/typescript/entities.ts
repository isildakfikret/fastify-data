import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

const entities: EntitySchemaOptions<any>[] = [
  {
    tableName: 'Employees',
    name: 'Employee',
    columns: {
      id: { type: 'integer', generated: true, primary: true },
      name: { type: 'text', nullable: false },
      age: { type: 'integer', nullable: false }
    }
  },
  {
    tableName: 'Departments',
    name: 'Department',
    columns: {
      id: { type: 'integer', generated: true, primary: true },
      name: { type: 'text', nullable: false }
    }
  }
];

export default entities;
