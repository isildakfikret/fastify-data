module.exports = {
  tableName: 'Employees',
  name: 'Employee',
  columns: {
    id: { type: 'integer', generated: true, primary: true },
    name: { type: 'text', nullable: false },
    age: { type: 'integer', nullable: false }
  }
};
