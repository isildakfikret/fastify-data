import fastify from 'fastify';
import httpClient from 'superagent';
import dataPlugin from '../src';
//@ts-ignore
import { createDbConfig, removeTestFiles, testDatabaseNames } from './context';

describe('Integration Tests With Single Data Source', () => {
  const app = fastify();
  const dsName1 = testDatabaseNames[1];
  const dsName2 = testDatabaseNames[2];
  const dbConfig1 = createDbConfig(dsName1);
  const dbConfig2 = createDbConfig(dsName2);
  const employee = { name: 'Jane Doe', age: 123 };

  beforeAll(async () => {
    //@ts-ignore
    app.register(dataPlugin, { dataSources: [dbConfig1, dbConfig2] });

    app.post('/employee', (req, res) => {
      const arg = req.body;
      // @ts-ignore
      const ds = req.query.ds;

      req
        .getDataSource(ds)
        .then(ds => ds.getRepository('Employee'))
        // @ts-ignore
        .then(repository => repository.save(arg))
        .then(entity => res.code(201).send(entity))
        .catch(err => res.code(500).send(err.message));
    });

    app.get('/employee', (req, res) => {
      // @ts-ignore
      const { id, ds } = req.query;

      req
        .getDataSource(ds)
        .then(ds => ds.getRepository('Employee'))
        .then(repository => repository.findOne({ where: { id } }))
        .then(entity => (entity ? res.code(200).send(entity) : res.code(404).send(`person not found`)))
        .catch(err => res.code(500).send(err.message));
    });

    await app.listen(8082, '127.0.0.1');
  });

  afterAll(async () => {
    await app.close();
    removeTestFiles();
  });

  [dsName1, dsName2].forEach(ds => {
    it(`the entity should be saved in ${ds}`, async () => {
      const response = await httpClient
        .post('http://127.0.0.1:8082/employee')
        .query({ ds })
        .set('Content-Type', 'application/json')
        .retry(3)
        .send(employee);

      expect(response.status).toEqual(201);
      expect(response.body.id).toEqual(expect.any(Number));
      expect(response.body.name).toEqual(employee.name);
      expect(response.body.age).toEqual(employee.age);
    });

    it(`the saved entity should exist in ${ds}`, async () => {
      const response = await httpClient
        .get('http://127.0.0.1:8082/employee')
        .query({ ds, id: 1 })
        .retry(3)
        .set('Content-Type', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body.id).toEqual(expect.any(Number));
      expect(response.body.name).toEqual(employee.name);
      expect(response.body.age).toEqual(employee.age);
    });
  });
});
