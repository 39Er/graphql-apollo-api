'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const cors = require('cors');
const { login, register } = require('./userOperation');

const { config, logger } = require('./global');

const app = express();
const port = config.get('port');

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
apa.use('/graphql', graphqlExpress((req) => {
 

}));

app.listen(port, (err) => {
  if (err) {
    logger.error(err);
  }
  logger.info('listening on %s', port);
});
