import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';

import { fileURLToPath } from 'url';
import path from 'node:path';

const fastify = Fastify({
  logger: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.get('/', function (req, reply) {
  reply.sendFile('/html/home.html');
});

try {
  await fastify.listen({ port: 8080 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
