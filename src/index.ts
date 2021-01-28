import fp from 'fastify-plugin';
import plugin from './plugin';

export default fp(plugin, {
  name: 'fastify-data',
  fastify: '>= 2.x'
});
