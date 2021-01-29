module.exports = (fastify, _options, next) => {
  fastify.route({
    url: '/employees',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'age'],
        properties: {
          name: { type: 'string', minLength: 2 },
          age: { type: 'integer', min: 20 }
        }
      }
    },
    handler: (request, reply) => {
      request
        .getDataSource()
        .then(ds => ds.getRepository('Employee'))
        .then(repository => repository.save(request.body))
        .then(entity => reply.code(201).send({ status: 'success', data: entity }))
        .catch(err => reply.code(500).send({ status: 'error', message: err.message }));
    }
  });

  fastify.route({
    url: '/employees',
    method: 'GET',
    schema: {
      querystring: {
        type: 'object',
        additionalProperties: false,
        required: ['employeeId'],
        properties: {
          employeeId: { type: 'string', pattern: '^[1-9]*[0-9]+$' }
        }
      }
    },
    handler: (request, reply) => {
      request
        .getDataSource()
        .then(ds => ds.getRepository('Employee'))
        .then(repository => repository.findOne({ where: { id: request.query.employeeId } }))
        .then(entity => {
          if (!entity) {
            reply.code(404).send({ status: 'fail', data: 'employee not found' });
          } else {
            reply.send({ status: 'success', data: entity });
          }
        })
        .catch(err => reply.code(500).send({ status: 'error', message: err.message }));
    }
  });

  fastify.route({
    url: '/departments',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 2 }
        }
      }
    },
    handler: (request, reply) => {
      request
        .getDataSource()
        .then(ds => ds.getRepository('Department'))
        .then(repository => repository.save(request.body))
        .then(entity => reply.code(201).send({ status: 'success', data: entity }))
        .catch(err => reply.code(500).send({ status: 'error', message: err.message }));
    }
  });

  next();
};
