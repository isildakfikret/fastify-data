import dataPlugin from '../../dist';
// @ts-ignore
import routes from './routes';
// @ts-ignore
import entities from './entities';
import fastify from 'fastify';

const app = fastify();

// @ts-ignore
app.register(dataPlugin, {
  dataSources: [
    {
      type: 'better-sqlite3',
      database: 'demo.db',
      synchronize: true,
      entities
    }
  ]
});

const endpoints: any[] = [];

app.addHook('onRoute', (opts: any) => {
  endpoints.push(opts);
});

app.ready(() => console.table(endpoints));

app.register(routes);

app.listen(8000, (err: Error, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Demo server started on ${address}`);
});
