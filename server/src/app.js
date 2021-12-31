import bodyParser from 'body-parser';
import Express from 'express';
import session from 'express-session';

import { apiRouter } from './routes/api';
import { staticRouter } from './routes/static';

const app = Express();

app.set('trust proxy', true);

app.use(
  session({
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb' }));

app.use((_req, res, next) => {
  res.header({
    'Cache-Control': 'max-age=0, no-transform',
    Connection: 'close',
  });
  return next();
});

app.get(/\.(js)$/, (req, res, next) => {
  req.url = `${req.url}.br`;
  res.set('Content-Type', 'application/javascript');
  res.set('Content-Encoding', 'br');
  next();
});

app.get(/\.(css)$/, (req, res, next) => {
  req.url = `${req.url}.br`;
  res.set('Content-Type', 'text/css');
  res.set('Content-Encoding', 'br');
  next();
});

app.use('/api/v1', apiRouter);
app.use(staticRouter);

export { app };
