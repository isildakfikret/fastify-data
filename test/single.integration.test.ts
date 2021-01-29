import fastify from 'fastify';
import httpClient from 'superagent';
import dataPlugin from '../src';
//@ts-ignore
import { createDbConfig, removeTestFiles } from './context';

describe('Integration Tests With Single Data Source', () => {
  const app = fastify();
  const dsName = 'single-demo';
  const dbConfig = createDbConfig(dsName);
  const employee = { name: 'Jane Doe', age: 123 };

  beforeAll(async () => {
    //@ts-ignore
    app.register(dataPlugin, { dataSources: [dbConfig] });

    app.post('/employee', (req, res) => {
      req
        .getDataSource(dsName)
        .then(ds => ds.getRepository('Employee'))
        // @ts-ignore
        .then(repository => repository.save(req.body))
        .then(entity => res.code(201).send(entity))
        .catch(err => res.code(500).send(err.message));
    });

    app.get('/employee', (req, res) => {
      // @ts-ignore
      const id = req.query.id;

      req
        .getDataSource(dsName)
        .then(ds => ds.getRepository('Employee'))
        .then(repository => repository.findOne({ where: { id } }))
        .then(entity => (entity ? res.code(200).send(entity) : res.code(404).send(`person not found`)))
        .catch(err => res.code(500).send(err.message));
    });

    await app.listen(8080, '127.0.0.1');
  });

  afterAll(async () => {
    await app.close();
    removeTestFiles(dsName);
  });

  it('the entity should be saved', async () => {
    const response = await httpClient
      .post('http://127.0.0.1:8080/employee')
      .set('Content-Type', 'application/json')
      .send(employee);

    expect(response.status).toEqual(201);
    expect(response.body.id).toEqual(expect.any(Number));
    expect(response.body.name).toEqual(employee.name);
    expect(response.body.age).toEqual(employee.age);
  });

  it('the saved entity should exist', async () => {
    const response = await httpClient
      .get('http://127.0.0.1:8080/employee')
      .set('Content-Type', 'application/json')
      .query({ id: 1 });

    expect(response.status).toEqual(200);
    expect(response.body.id).toEqual(expect.any(Number));
    expect(response.body.name).toEqual(employee.name);
    expect(response.body.age).toEqual(employee.age);
  });
});
