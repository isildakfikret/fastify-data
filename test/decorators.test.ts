import fastify from 'fastify';
import dataPlugin from '../src';
// @ts-ignore
import { createDbConfig, removeTestFiles } from './context';

describe('Decorator Tests', () => {
  const app = fastify();

  beforeAll(() => {
    const config = createDbConfig();
    app.register(dataPlugin, { dataSources: [config] });
  });

  it('all decorators should be defined when the plugin registered', done => {
    app.ready(() => {
      expect(app.hasRequestDecorator('getDataSource')).toBeTruthy();
      expect(app).toHaveProperty('dataSources');
      done();
    });
  });
});
