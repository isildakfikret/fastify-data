import fastify from 'fastify';
import dataPlugin from '../src';
// @ts-ignore
import { createDbConfig, removeTestFiles, testDatabaseNames } from './context';

describe('Decorators Tests', () => {
  const app = fastify();

  it('all decorators should be defined when the plugin registered', done => {
    const config = createDbConfig(testDatabaseNames[0]);
    app.register(dataPlugin, { dataSources: [config] });

    app.ready(() => {
      expect(app.hasRequestDecorator('getDataSource')).toBeTruthy();
      expect(app).toHaveProperty('dataSources');
      done();
    });
  });

  afterAll(() => removeTestFiles());
});
