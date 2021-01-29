const fastify = require('fastify');
const dataPlugin = require('../../dist');
const routes = require('./routes');

const departmentSchema = require('./entity/department.json');
const employeeSchema = require('./entity/employee');

const app = fastify();

app.register(dataPlugin, {
  dataSources: [
    {
      type: 'better-sqlite3',
      database: 'demo.db',
      synchronize: true,
      entities: [departmentSchema, employeeSchema]
    }
  ]
});

const endpoints = [];

app.addHook('onRoute', opts => {
  endpoints.push(opts);
});

app.ready(() => console.table(endpoints));

app.register(routes);

app.listen(8000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Demo server started on ${address}`);
});
