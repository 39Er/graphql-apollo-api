'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const cors = require('cors');

const { config, logger } = require('./global');
const { login, register } = require('./userOperation');
const schema = require('./schema');
const { User, Pet } = require('./mongo/models');

const app = express();
const port = config.get('port');

//  connect redis
const redisClient = redis.createClient(config.get('redis'));
redisClient.on('error', (err) => {
  logger.error(err);
  process.exit(1);
});

let corsOptions = {
  origin: function (origin, callback) {
    let whitelist = config.get('whitelist');
    if (whitelist.length === 0) {
      return callback(null, true);
    }
    if (whitelist.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'application/graphql' }));

app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    client: redisClient,
  }),
  secret: 'ACDataServer',
  cookie: {
    maxAge: 12 * 60 * 60 * 1000,
  },
  proxy: true,
  saveUninitialized: true,
  resave: false,
}));

app.post('/login', login);
app.post('/register', register);
app.use('/graphql', graphqlExpress((req) => {
  if (req.is('application/graphql')) {
    req.body = { query: req.body };
  }
  if (!req.session || !req.session.user) {
    logger.error('Session is invilid');
    throw new Error('Session is invilid');
  }
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    throw new Error('Query too large.');
  }
  return {
    schema,
    context: {
      req: req,
      User: new User(),
      Pet: new Pet(),
    },
    formatError: (e) => {
      logger.error(e.message);
      return e;
    },
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `{
    hello
  }
  `,
}));

app.listen(port, (err) => {
  if (err) {
    logger.error(err);
  }
  logger.info('listening on %s', port);
});
