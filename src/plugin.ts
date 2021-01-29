import { FastifyPluginCallback } from 'fastify';
import { Connection, ConnectionOptions, createConnection, EntitySchema } from 'typeorm';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions';

declare module 'fastify' {
  interface FastifyInstance {
    dataSources: Map<string, Promise<Connection>>;
  }

  interface FastifyRequest {
    getDataSource: (dsName?: string) => Promise<Connection>;
  }
}

declare module 'typeorm' {
  interface BaseConnectionOptions {
    entities?: EntitySchemaOptions<any>[];
  }
}

export interface DataSourcesOptions {
  readonly dataSources?: ConnectionOptions[];
}

const plugin: FastifyPluginCallback<DataSourcesOptions> = (instance, options, done) => {
  instance.dataSources = new Map();

  if (options.dataSources && options.dataSources.length > 0) {
    options.dataSources.forEach(config => {
      const cfg: ConnectionOptions = { ...config, entities: [] };
      // @ts-ignore
      let entities = config.entities?.map(e => new EntitySchema(e));
      // @ts-ignore
      cfg.entities?.push(...entities);
      const dataSource = createConnection(cfg);
      instance.dataSources.set(config.name || 'default', dataSource);
    });
  }

  instance.decorateRequest('getDataSource', (dsName?: string) => {
    return instance.dataSources.get(dsName || 'default');
  });

  instance.addHook('onClose', () => {
    instance.dataSources.forEach(async dataSource => {
      const db = await dataSource;
      await db.close();
    });
  });

  done();
};
export default plugin;
