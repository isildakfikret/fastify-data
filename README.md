<div align="center" >

<img src="https://simpleicons.org/icons/fastify.svg" width="64">
<img src="https://raw.githubusercontent.com/typeorm/typeorm/master/resources/logo_big.png" height="64" width="144">

<h1>Fastify Data</h1>

![GitHub release (latest by date)](https://img.shields.io/github/v/release/isildakfikret/fastify-data?logo=github)
![npm](https://img.shields.io/npm/v/fastify-data?logo=npm)
![GitHub](https://img.shields.io/github/license/isildakfikret/fastify-data)

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/isildakfikret/fastify-data/ci/master)
![GitHub branch checks state](https://img.shields.io/github/checks-status/isildakfikret/fastify-data/master)
![Coveralls github branch](https://img.shields.io/coveralls/github/isildakfikret/fastify-data/master?logo=coveralls)
![GitHub issues](https://img.shields.io/github/issues-raw/isildakfikret/fastify-data)
![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/isildakfikret/fastify-data)

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/isildakfikret/fastify-data)
![npm](https://img.shields.io/npm/dt/fastify-data?logo=npm)
![GitHub all releases](https://img.shields.io/github/downloads/isildakfikret/fastify-data/total?logo=github)

<hr />

</div>

- uses typeorm
- supports multiple data sources
- easy to use and operate

## Installation

- install with npm:

  ```shell
  npm i fastify-data
  ```

- install with yarn:

  ```shell
  yard add fastify-data
  ```

## Usage

**1. Step: Setup**

```javascript
const app = require('fastify')();
const fastifyData = require('fastify-data');

const employeeSchema = {
  tableName: 'People',
  name: 'Person',
  columns: {
    id: { type: 'integer', primary: true, generated: true },
    firstName: { type: 'text', nullable: false },
    lastName: { type: 'text', nullable: false }
  }
};

const sqliteOptions = {
  name: 'db1',
  type: 'better-sqlite3',
  database: 'demo.db',
  synchronize: true,
  entities: [employeeSchema]
};

const mysqlOptions = {
  name: 'db2',
  type: 'mysql',
  username: 'root',
  password: 'demo',
  database: 'demo',
  synchronize: true,
  entities: [employeeSchema]
};

app.register(fastifyData, { dataSources: [sqliteOptions, mysqlOptions] });
```

**2. Step: Using in handler**

```javascript
app.post('/register', function (req, res) {
  req
    .getDataSource('db1')
    .then(ds => ds.getRepository('Employee'))
    .then(repository => repository.save({ firstName: 'Jane', lastName: 'Doe' }))
    .then(entity => res.code(201).send(entity))
    .catch(err => res.code(500).send(err.message));
});

app.get('/profile', (req, res) => {
  req
    .getDataSource('db2')
    .then(ds => ds.getRepository('Employee'))
    .then(repository => repository.findOne({ where: { id: req.query.id } }))
    .then(entity => {
      if (entity) {
        res.code(200).send({ status: 'success', data: entity });
      } else {
        res.code(404).send({ status: 'fail', message: 'employee not found' });
      }
    })
    .catch(err => res.code(500).send(err.message));
});

app.put('/update', async (req, res) => {
  const { firstName, lastName, id } = req.body;

  // get data source
  const ds = await req.getDataSource('db2');
  // get repository and update the employee
  const entity = await ds.getRepository('Employee').save({ firstName, lastName, id });

  return { status: 'access', data: entity };
});
```

## License

Licensed under [MIT](./LICENSE).
